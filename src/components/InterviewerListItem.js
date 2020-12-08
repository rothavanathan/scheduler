import React from "react";

import "components/InterviewerListItem.scss";

const classNames = require('classnames');


export default function InterviewerListItem(props) {
  const {id, name, avatar, selected, setInterviewer} = props

  const interviewerClasses = classNames({
    "interviewers__item": true,
    
    "interviewers__item--selected": selected
  })
  
  const interviewerImgClasses = classNames({
    "interviewers__item-image": true,
    
    "interviewers__item-image--selected": selected
  })

  return (
  <li 
    className={interviewerClasses}
    key={id}
    onClick={()=> setInterviewer(name)}>
    <img
      className={interviewerImgClasses}
      src={avatar}
      alt={name}
    /> {selected ? name : ""}
  </li>
  )
};  
