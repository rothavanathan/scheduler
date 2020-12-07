import React from "react";

import "components/DayListItem.scss";

const classNames = require('classnames');


export default function DayListItem(props) {

  const {name, spots, selected, setDay} = props;

  const isFull = spots === 0;

  const liClass = classNames(
    "day-list__item",
    {
      "day-list__item--selected": selected,
      "day-list__item--full": isFull
    }
  );

  return (
    <li className={liClass} onClick={() => {setDay(name)}}>
      <h2 className="text--regular">{name}</h2> 
      <h3 className="text--light">{spots} spots remaining</h3>
    </li>
  );
}
