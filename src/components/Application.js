import React, { useState, useEffect } from "react";
import axios from "axios";


import DayList from "./DayList.js";
import Appointment from "./Appointment";
import "components/Application.scss";
import { getAppointmentsForDay } from "../helpers/selectors"


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  })
  
  const setDay = day => setState(prev => (
      { ...prev, day }
    )
  );
  
  // const setDays = days => setState(prev => (
  //     { ...prev, days }
  //   )
  // );
  
  // const setAppointments = appointments => setState(prev => (
  //     { ...prev, appointments }
  //   )
  // );

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
          appointments: appointments.data
        }

      })
    })
    .catch(err => {
      console.log(err)
    })
  }, [])


  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const appointmentList = dailyAppointments.map((appointment, index) => {
    return <Appointment key={index} {...appointment}/>
  })
  //tag on extra header to complete the wrapping of appointment blocks with time headers
  appointmentList.push(<Appointment key="last" time="5pm" />)

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
        {appointmentList}
      </section>
    </main>
  );
}
