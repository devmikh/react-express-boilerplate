import React from "react";

import "./SidebarListItem.scss";
var classNames = require("classnames");

export default function SidebarListItem(props) {
  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0,
  });

  return (
    <li
      onClick={() => {
        props.setState({
          ...props.state,
          currentItem: null,
          tab: props.name,
          renderForm: false,
          renderEditForm: false,
        });
      }}
      className={dayClass}
      data-testid="day"
    >
      <h2 className="text--regular">
        <i class={props.icon} aria-hidden="true"></i>
        {` ${props.name}`}
      </h2>
    </li>
  );
}
