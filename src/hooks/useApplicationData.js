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

  function getDayIndexFromAppointmentId(appointmentId) {
    const targetDay = state.days.find(day => day.appointments.includes(appointmentId))
    const dayIndex = targetDay.id - 1
    return dayIndex;
  }

  const getDays = () => {
    return axios.get(`/api/days`)
  };

  const getInterviewers = () => {
    return axios.get(`/api/interviewers`)
  };

  const getAppointments = () => {
    return axios.get(`/api/appointments`)
  };

  
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

      case "CANCEL_INTERVIEW": {
        const {appointments} = action;
        return {...state, appointments}
      }

      case "BOOK_INTERVIEW": {
        const {appointments} = action;
        return {...state, appointments}
      }

      case "DECREMENT_SPOTS": {
        const {days} = action;
        return {...state, days}
      }
      
      case "INCREMENT_SPOTS": {
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

  //promise all to get all resources
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


  
  
  const setDay = day => {
    dispatch({type: "SET_DAY", day})
  }

  function bookInterview(id, interview, changeSpots = false) {
    return axios.put(`/api/appointments/${id}`, {interview, changeSpots})
      .then(() => {
        console.log(`after book interview put request`)
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview }
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        if (changeSpots) {
          const dayIndex = getDayIndexFromAppointmentId(id);
          const newDay = {...state.days[dayIndex], spots: state.days[dayIndex].spots - 1}
          const newDays = state.days.map((day, index) => {
            return index === dayIndex ? newDay : state.days[index]
          })
          dispatch({
            type: "DECREMENT_SPOTS",
            days: newDays
          })
        }
        dispatch({
          type: "BOOK_INTERVIEW",
          appointments
        })
      })
  };

  function cancelInterview(id) {
    const dayIndex = getDayIndexFromAppointmentId(id);
    return axios({
      method: "DELETE",
      url: `/api/appointments/${id}`,
    })
    .then(() => {
      const appointment = {
        ...state.appointments[id],
        interview: null
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      //update spots value for day that contained appointment
      const newDay = {...state.days[dayIndex], spots: state.days[dayIndex].spots + 1}
      const newDays = state.days.map((day, index) => {
          return index === dayIndex ? newDay : day
      })
      dispatch({
        type: "DECREMENT_SPOTS",
        days: newDays
      })
      dispatch({
        type: "CANCEL_INTERVIEW",
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