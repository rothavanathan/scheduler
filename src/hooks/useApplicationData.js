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
    return axios({
      url: `/api/days`,
      method: 'GET'
    })
  };

  const getInterviewers = () => {
    return axios({
      url: `/api/interviewers`,
      method: 'GET'
    })
  };

  const getAppointments = () => {
    return axios({
      url: `/api/appointments`,
      method: 'GET'
    })
  };

  
  function reducer(state, action) {
    switch (action.type) {

      case "INITIAL_DATA": {
        const {days, interviewers, appointments} = action;
        console.log(`days in initial_data reducer case is`, days)
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
      console.log(days.data, interviewers.data, appointments.data)
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
    return axios({
      method: "PUT",
      url: `/api/appointments/${id}`,
      data: {interview}
    }).then(() => {
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
        state.days[dayIndex].spots--;
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
      state.days[dayIndex].spots++;
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