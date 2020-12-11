import React, { useState, useEffect } from "react";
import axios from "axios";


import DayList from "./DayList.js";
import Appointment from "./Appointment";
import "components/Application.scss";
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "../helpers/selectors"


export default function Application(props) {
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


  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);


  function bookInterview(id, interview) {
    return axios
      ({
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
      }).catch(err => console.log(`There was an error creating the appointment:`, err))
  };

  function cancelInterview(id, interview) {
    return axios
      ({
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
      }).catch(err => console.log(`There was an error deleting the appointment:`, err))
  };


  const schedule = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    console.log(`interview is: `, interview)

    return <Appointment 
    key={appointment.id} 
    id={appointment.id}
    time={appointment.time}
    interview={interview}
    interviewers={dailyInterviewers}
    bookInterview={bookInterview}
    cancelInterview={cancelInterview}
    />
  })
  //tag on extra header to complete the wrapping of appointment blocks with time headers
  schedule.push(<Appointment key="last" time="5pm" />)

  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList
          days={state.days}
          day={state.day}
          setDay={setDay}
        />

      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />

      </section>
      <section className="schedule">
        {schedule}
      </section>
    </main>
  );
}
