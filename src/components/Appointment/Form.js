import React, {useState} from "react";

import InterviewerList from "../InterviewerList.js";

import Button from "../Button.js";

export default function Form(props) {
  
  const {interviewers, onSave, onCancel, changeSpots} = props;

  // console.log(`onChange is: `, setInterviewer)
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);

  const reset = () => {
    setName("")
    setInterviewer(null)
  }

  const cancel = () => {
    reset();
    onCancel();
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    console.log(`form was submitted`)
  }



  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form onSubmit={handleFormSubmit} autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            /*
              This must be a controlled component
            */
          />
        </form>
        <InterviewerList 
        interviewers={interviewers}
        interviewer={interviewer}
        setInterviewer={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={cancel} danger>Cancel</Button>
          <Button onClick={() => onSave(name, interviewer, changeSpots)} confirm>Save</Button>
        </section>
      </section>
    </main>

  )

}