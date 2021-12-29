import React from "react";
import "./Tooltip.scss";

const Tooltip = (props) => {
  return (
    <div className="tooltip" style={props.style}>
      {props.children}
      <span className="tooltiptext">{props.tooltiptext}</span>
    </div>
  );
};

export default Tooltip;
