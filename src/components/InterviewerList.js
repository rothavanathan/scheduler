import React from "react";

import "components/InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";

export default function InterviewerList(props) {
  const {interviewers, interviewer, setInterviewer} = props;
  


  return (
 <section className="interviewers">
  <h4 className="interviewers__header text--light">{interviewer}</h4>
  <ul className="interviewers__list">
    interviewerListItems go here
  </ul>
</section>

  )
};  
