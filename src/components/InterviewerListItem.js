import React from "react";

import "components/DayListItem.scss";

const classNames = require('classnames');


export default function InterviewerListItem(props) {
  const {id, name, avatar, selected, setInterviewer} = props


  return (
  <li className="interviewers__item">
    <img
      className="interviewers__item-image"
      src={avatar}
      alt={name}
    /> {name}
  </li>
)

}
