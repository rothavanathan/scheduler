import React from "react";

import "./styles.scss";
import useVisualMode from "../../hooks/useVisualMode"

import Header from "./Header.js";
import Empty from "./Empty.js";
import Show from "./Show.js";
import Form from "./Form.js";
import Status from "./Status.js";

export default function Appointment(props) {
  const {time, interview, interviewers, id, bookInterview} = props
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE"
  const SAVING = "SAVING"

  const {transition, back, mode} = useVisualMode(
    interview ? SHOW : EMPTY
  );

  

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    console.log(`in save function interview is`, interview)
    transition(SAVING)
    bookInterview(id, interview)
      .then(success => transition(SHOW))
  }
  

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} bookInterview={bookInterview}/>}

      {mode === SHOW && ( <Show 
      student={interview.student} 
      name={interview.interviewer.name} 
      interviewer={interview.interviewer}
      bookInterview={bookInterview} 
      /> 
      )}

      {mode === CREATE && <Form onCancel={back} onSave={save} interviewers={interviewers} bookInterview={bookInterview} id={id}></Form>}

      {mode === SAVING && <Status message="Saving..."/>}
    </article>
  )
};  