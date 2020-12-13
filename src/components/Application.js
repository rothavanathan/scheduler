import React from "react";

import useApplicationData from "../hooks/useApplicationData"
import "components/Application.scss";

import DayList from "./DayList.js";
import Appointment from "./Appointment";

import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "../helpers/selectors"


export default function Application(props) {
  
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  console.log(`state is`, state)


  const dailyInterviewers = getInterviewersForDay(state, state.day);  
  const schedule = getAppointmentsForDay(state, state.day).map((appointment) => {
  const interview = getInterview(state, appointment.interview);


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
          state={state}
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
