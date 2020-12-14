import React from "react";
import PropTypes from 'prop-types';

import "components/InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";

function InterviewerList(props) {


  const {interviewers, interviewer, setInterviewer} = props;
  
  // const switchInterviewer = () => {
  //   setInterviewer(prev => {
  //     console.log(`previous state was`, prev)
  //   })
  // }
  
  const results = interviewers.map(interviewerData => {
    return <InterviewerListItem 
      key={interviewerData.id}
      name={interviewerData.name}
      avatar={interviewerData.avatar}
      setInterviewer={(event)=> {
        setInterviewer(interviewerData.id)}}
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

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
}


export default InterviewerList;