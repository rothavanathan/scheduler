import React, { useState, useEffect } from "react";
import axios from "axios";

import DayList from "./DayList.js";
import Appointment from "./Appointment";
import "components/Application.scss";


const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 1,
    time: "1pm",
    interview: {
      student: "Guido van Rossum",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 1,
    time: "2pm",
    interview: {
      student: "Ryan Dahl",
      interviewer: {
        id: 3,
        name: "Mildred Nazir",
        avatar: "https://i.imgur.com/T2WwVfS.png",
      }
    }
  },
  {
    id: 1,
    time: "4pm",
    interview: {
      student: "Dan Abramov",
      interviewer: {
        id: 5,
        name: "Sven Jones",
        avatar: "https://i.imgur.com/twYrpay.jpg",
      }
    }
  }
];


export default function Application(props) {

  const [days, setDays] = useState([]);
  const [day, setDay] = useState("Monday");

  useEffect(() => {
    axios({
      url: `/api/days`,
      method: 'GET'
    })
    .then(results => {
      
      setDays(results.data)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  

  const appointmentList = appointments.map((appointment, index) => {
    return <Appointment key={index} {...appointment}/>
  })

  appointmentList.push(<Appointment key="last" time="5pm" />
  )

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
          days={days}
          day={day}
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
