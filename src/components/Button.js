import React from "react";

import "components/Button.scss";
const classNames = require('classnames');

export default function Button(props) {
   const {confirm, danger} = props;
   const buttonClass = classNames({
      button: true, 
      "button--confirm": confirm, 
      "button--danger": danger
   })
  

   return (
      <button 
         disabled={props.disabled} 
         onClick={props.onClick} 
         className={buttonClass}
      >
         {props.children}
      </button>
   );
}
