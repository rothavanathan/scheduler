import React from "react";
import "./styles.scss";
import useVisualMode from "../../hooks/useVisualMode"

import Header from "./Header.js";
import Empty from "./Empty.js";
import Show from "./Show.js";
import Form from "./Form.js";
import Status from "./Status.js";
import Confirm from "./Confirm.js";
import Error from "./Error.js";


export default function Appointment(props) {
  
  const {time, interview, interviewers, id, bookInterview, cancelInterview} = props
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE"
  const SAVING = "SAVING"
  const DELETING = "DELETING"
  const CONFIRM = "CONFIRM"
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";



  const {transition, back, mode} = useVisualMode(
    interview ? SHOW : EMPTY
  );

  function save(name, interviewer, changeSpots) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    bookInterview(id, interview, changeSpots)
      .then(() => {
        transition(SHOW)
      })
      .catch(() => transition(ERROR_SAVE, true))
  }

  function editTransition() {
    transition(EDIT)
  }
  
  function deleteRequest() {
    transition(CONFIRM)
  }

  function deleteInterview() {

    transition(DELETING, true)
    cancelInterview(id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true))
  }

  return (
    <article 
    className="appointment"
    data-testid="appointment"
    >
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)}/>}

      {mode === SHOW && ( <Show 
      student={interview.student} 
      name={interview.interviewer.name} 
      interviewer={interview.interviewer}
      bookInterview={bookInterview}
      deleteInterview={deleteInterview}
      deleteRequest={deleteRequest}
      onEdit={editTransition}
      /> )}

      {mode === CREATE && <Form onCancel={back} onSave={save} interviewers={interviewers} changeSpots={true}></Form>}
      {mode === EDIT && <Form onCancel={back} onSave={save} interviewers={interviewers} name={interview.student} interviewer={interview.interviewer.id} changeSpots={false}></Form>}

      {mode === SAVING && <Status message="Saving..."/>}
      {mode === DELETING && <Status message="Deleting..."/>}
      
      {mode === CONFIRM && <Confirm
        onCancel={back}
        onConfirm={deleteInterview}
      />}

      {mode === ERROR_SAVE && <Error 
        message="Whoops. Something went wrong with saving the interview. Try again." 
        onClose={back}
      />}
      {mode === ERROR_DELETE && <Error 
        message="Whoops. Something went wrong with deleting the interview. Try again." 
        onClose={back}
      />}
    </article>
  )
};  