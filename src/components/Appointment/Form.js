import React, {useState} from "react";

import InterviewerList from "../InterviewerList.js";

import Button from "../Button.js";

export default function Form(props) {
  
  const {interviewers, onSave, onCancel, changeSpots} = props;

  // console.log(`onChange is: `, setInterviewer)
  const [name, setName] = useState(props.name || "");  
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

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

  function validate(name, interviewer, changeSpots) {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }
  
    onSave(name, interviewer, changeSpots);
  }
  



  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form onSubmit={handleFormSubmit} autoComplete="off">
          <input
            data-testid="student-name-input"
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
          <section className="appointment__validation">{error}</section>

          <InterviewerList 
          interviewers={interviewers}
          interviewer={interviewer}
          setInterviewer={setInterviewer}
          />
        </form>
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={cancel} danger>Cancel</Button>
          <Button onClick={() => validate(name, interviewer, changeSpots)} confirm>Save</Button>
        </section>
      </section>
    </main>

  )

}