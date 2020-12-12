import React from "react";

import "./styles.scss";
import useVisualMode from "../../hooks/useVisualMode"

import Header from "./Header.js";
import Empty from "./Empty.js";
import Show from "./Show.js";
import Form from "./Form.js";
import Status from "./Status.js";
import Confirm from "./Confirm.js";

export default function Appointment(props) {
  const {time, interview, interviewers, id, bookInterview, cancelInterview} = props
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE"
  const SAVING = "SAVING"
  const DELETING = "DELETING"
  const CONFIRM = "CONFIRM"
  const EDIT = "EDIT"

  const {transition, back, mode} = useVisualMode(
    interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    bookInterview(id, interview)
      .then(success => transition(SHOW))
  }

  function editTransition() {
    transition(EDIT)
  }
  
  function deleteRequest(name, interviewer) {
    const interview = {};
    transition(CONFIRM)
  }

  function deleteInterview(name, interviewer) {
    const interview = {};
    transition(DELETING)
    cancelInterview(id, interview)
      .then(success => transition(EMPTY))
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
      deleteInterview={deleteInterview}
      deleteRequest={deleteRequest}
      onEdit={editTransition}
      /> )}

      {mode === CREATE && <Form onCancel={back} onSave={save} interviewers={interviewers}></Form>}
      {mode === EDIT && <Form onCancel={back} onSave={save} interviewers={interviewers} name={interview.student} interviewer={interview.interviewer.id}></Form>}

      {mode === SAVING && <Status message="Saving..."/>}
      {mode === DELETING && <Status message="Deleting..."/>}
      
      {mode === CONFIRM && <Confirm 
        message="Are you sure you want to delete?" 
        onCancel={back}
        onConfirm={deleteInterview}
      />}
    </article>
  )
};  