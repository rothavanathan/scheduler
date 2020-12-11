import React from "react";

import "./styles.scss";
import useVisualMode from "../../hooks/useVisualMode"

import Header from "./Header.js";
import Empty from "./Empty.js";
import Show from "./Show.js";
import Form from "./Form.js";

export default function Appointment(props) {
  const {time, interview, interviewers} = props
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE"
  const {transition, back, mode} = useVisualMode(
    interview ? SHOW : EMPTY
  );

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}

      {mode === SHOW && ( <Show 
      student={interview.student} 
      name={interview.interviewer.name} 
      interviewer={interview.interviewer} 
      /> 
      )}

      {mode === CREATE && <Form onCancel={back} onSave={transition} interviewers={interviewers}></Form>}
    </article>
  )
};  