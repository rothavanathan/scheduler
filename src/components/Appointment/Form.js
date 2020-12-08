import React from "react";

import InterviewerList from "../InterviewerList.js";

import Button from "../Button.js";

export default function Form(props) {
  
  const {name, interviewers, interviewer: value, onSave, onCancel, onChange} = props;

  // console.log(`onChange is: `, setInterviewer)
  
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            /*
              This must be a controlled component
            */
          />
        </form>
        <InterviewerList 
        interviewers={interviewers}
        value={value}
        setInterviewer={(event) => onChange(event)}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={onCancel} danger>Cancel</Button>
          <Button onClick={onSave} confirm>Save</Button>
        </section>
      </section>
    </main>

  )

}