import React from "react";

import "./styles.scss";
import Header from "./Header.js";
import Empty from "./Empty.js";
import Show from "./Show.js";

export default function Appointment(props) {
  const {time, interview} = props

  return (
    <article className="appointment">
      <Header time={time} />
      {interview ? <Show student={interview.student} name={interview.interviewer.name} interviewer={interview.interviewer} /> : <Empty />}
    </article>
  )
};  