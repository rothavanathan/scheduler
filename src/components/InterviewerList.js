import React from "react";

import "components/InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";

export default function InterviewerList(props) {
  const {interviewers, interviewer, setInterviewer} = props;
  
  const results = interviewers.map(interviewerData => {
    return <InterviewerListItem 
    id={interviewerData.id} 
    name={interviewerData.name}
    avatar={interviewerData.avatar}
    setInterviewer={setInterviewer}
    selected={interviewerData.id === interviewer}
    />
  })

  return (
 <section className="interviewers">
  <h4 className="interviewers__header text--light">Interviewer</h4>
  <ul className="interviewers__list">
    {results}
  </ul>
</section>

  )
};  
