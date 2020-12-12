import {useState, useEffect} from "react";
import axios from "axios";

export default function useApplicationData(){
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })
  
  const setDay = day => setState(prev => (
      { ...prev, day }
    )
  );

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


  //promise all to get all resources
  useEffect(() => {
    Promise.all([
      getDays(),
      getInterviewers(),
      getAppointments()
    ])
    .then(([days, interviewers, appointments]) => {
      console.log(days.data, interviewers.data, appointments.data)
      setState(prev => {
        return {
          ...prev,
          days: days.data,
          interviewers: interviewers.data,
          appointments: appointments.data
        }

      })
    })
    .catch(err => {
      console.log(err)
    })
  }, [])


 


  function bookInterview(id, interview) {
    return axios({
          method: "PUT",
          url: `/api/appointments/${id}`,
          data: {interview}
      }).then(res => {
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview }
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        setState(prev => ({...prev, appointments}));
      })
  };

  function cancelInterview(id) {
    return axios({
        method: "DELETE",
        url: `/api/appointments/${id}`,
      })
      .then(res => {
        const appointment = {
          ...state.appointments[id],
          interview: null
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        setState(prev => ({...prev, appointments}));
      })
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}