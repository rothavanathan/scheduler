import React from 'react';

import DayListItem from "./DayListItem";

import "components/DayListItem.scss";

// const classNames = require('classnames');

export default function DayList(props){
  const {days, setDay} = props

  return (
    <ul title="dayList">
      {days.map(day=> {
        return (
        <DayListItem
          key={day.id}
          name={day.name} 
          spots={day.spots} 
          selected={day.name === props.day}
          setDay={setDay}  />
        )
      })}
    </ul>
  )
};