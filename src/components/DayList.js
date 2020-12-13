import React, {useEffect} from 'react';

import DayListItem from "./DayListItem";

import "components/DayListItem.scss";

// const classNames = require('classnames');

export default function DayList(props){
  const {days, state, setState, setDay} = props
  let count = 0;
  let dayCount = [];

  return (
    <ul>
      {days.map((day, index) => {
        console.log(dayCount)
        return (
        <DayListItem 
          key={day.id}
          name={day.name} 
          spots={dayCount[index] || day.spots} 
          selected={day.name === props.day}
          setDay={setDay}  />
        )
      })}
    </ul>
  )
};