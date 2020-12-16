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

  //construct and return new state.appointments object when updating appointments
  const newStateAppointments = (id, interview = null) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return appointments
  }

  //constructs and returns new state.days object when changingSpots
  const newStateDays = (dayIndex, increment = true) => {
    const newSpots = increment ? state.days[dayIndex].spots + 1 : state.days[dayIndex].spots - 1;
    const newDay = {...state.days[dayIndex], spots: newSpots}
    const newDays = state.days.map((day, index) => {
      return index === dayIndex ? newDay : state.days[index]
    })
    return newDays
  }

  function bookInterview(id, interview, changeSpots = false) {
    return axios.put(`/api/appointments/${id}`, {interview, changeSpots})
      .then(() => {
        
        const appointments = newStateAppointments(id, interview);
        if (changeSpots) {
          const dayIndex = getDayIndexFromAppointmentId(id);
          const newDays = newStateDays(dayIndex, false);
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

  function cancelInterview(id) {
    const dayIndex = getDayIndexFromAppointmentId(id);
    return axios.delete(`/api/appointments/${id}`)
    .then(() => {
      const appointments = newStateAppointments(id);
      //update spots value for day that contained appointment
      const newDays = newStateDays(dayIndex, true);
      dispatch({
        type: "CHANGE_SPOTS",
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