import React from "react";

import "components/InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";

export default function InterviewerList(props) {
  const {interviewers, interviewer: value, setInterviewer: onChange} = props;
  
  const results = interviewers.map(interviewerData => {
    return <InterviewerListItem 
    name={interviewerData.name}
    avatar={interviewerData.avatar}
    setInterviewer={(event)=> {onChange(interviewerData.id)}}
    selected={interviewerData.id === value}
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
