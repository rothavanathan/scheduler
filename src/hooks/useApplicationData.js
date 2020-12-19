import {useReducer, useEffect} from "react";
import axios from "axios";

export default function useApplicationData(){
  

  const initialState = {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  
  function reducer(state, action) {
    switch (action.type) {

      case "INITIAL_DATA": {
        const {days, interviewers, appointments} = action;
        return {...state,
          days,
          interviewers,
          appointments
        }
      }

      case "SET_DAY": {
        return {...state, day: action.day};
      }

      case "BOOK_INTERVIEW": {
        const {appointments} = action;
        return {...state, appointments}
      }

      case "CHANGE_SPOTS": {
        const {days} = action;
        return {...state, days}
      }
      
      
      default: {
        return new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
      }
    } 
  }

  function getDayIndexFromAppointmentId(appointmentId) {
    const targetDay = state.days.find(day => day.appointments.includes(appointmentId))
    const dayIndex = targetDay.id - 1
    return dayIndex;
  }

  //API calls to fetch data
  const getDays = () => {
    return axios.get(`/api/days`)
  };

  const getInterviewers = () => {
    return axios.get(`/api/interviewers`)
  };

  const getAppointments = () => {
    return axios.get(`/api/appointments`)
  };


  //populate data on page load
  useEffect(() => { 
    Promise.all([
      getDays(),
      getInterviewers(),
      getAppointments()
    ])
    .then(([days, interviewers, appointments]) => {
      dispatch({
          type: "INITIAL_DATA",
          days: days.data,
          interviewers: interviewers.data,
          appointments: appointments.data
        })
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

    //web socket stuff
  // const socket = new WebSocket("ws://localhost:8001");

  // useEffect(()=>{
  //   // Connection opened
  //   socket.addEventListener('open', function (event) {
  //   socket.send('ping');
  // });
  // // Listen for messages
  // socket.addEventListener('message', function (event) {
  //   console.log('Message from server ', JSON.parse(event.data));
  // });
  // return () => {
  //   socket.removeEventListener('open', function (event) {
  //     socket.send('ping');
  //   });
  //   socket.removeEventListener('message', function (event) {
  //     console.log('removing scoket event listener');
  //   });
  //   socket.close()
  //   }
  // }, [])

  //change state.Day to look at appointments for selected day
  
  const setDay = day => {
    dispatch({type: "SET_DAY", day})
  }

  //construct and return new state.appointments object when updating appointments
  const newStateAppointments = (id, interview = null) => {
    
    const appointment = {
      ...state.appointments[id],
      interview: interview ? { ...interview }: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return appointments
  }

  //constructs and returns new state.days object when changingSpots
  const newStateDays = (dayIndex, increment = 0) => {
    const newSpots = state.days[dayIndex].spots + increment;
    const newDay = {...state.days[dayIndex], spots: newSpots}
    const newDays = state.days.map((day, index) => {
      return index === dayIndex ? newDay : state.days[index]
    })
    return newDays
  }

  //used for creating and updating interviews
  function bookInterview(id, interview, changeSpots = false) {
    return axios.put(`/api/appointments/${id}`, {interview, changeSpots})
      .then(() => {
        const appointments = newStateAppointments(id, interview);
        //check if we're updating or creating
        if (changeSpots) {
          const dayIndex = getDayIndexFromAppointmentId(id);
          const newDays = newStateDays(dayIndex, -1);
          dispatch({
            type: "CHANGE_SPOTS",
            days: newDays
          })
        }
        dispatch({
          type: "BOOK_INTERVIEW",
          appointments
        })
      })
  };

  //used for deleting interview
  function cancelInterview(id) {
    const dayIndex = getDayIndexFromAppointmentId(id);
    return axios.delete(`/api/appointments/${id}`)
    .then(() => {
      const appointments = newStateAppointments(id);
      //update spots value for day that contained appointment, increment spots true
      const newDays = newStateDays(dayIndex, 1);
      dispatch({
        type: "CHANGE_SPOTS",
        days: newDays
      })
      dispatch({
        type: "BOOK_INTERVIEW",
        appointments
      })
    })
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}