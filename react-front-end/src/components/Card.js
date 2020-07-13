import React from "react";
import "./Card.scss";

export default function Card(props) {
  const { title, total, icon, safe, caution, danger } = props;
  let iconContainerClass = "card-icon-container";

  if (safe) {
    iconContainerClass += "-safe";
  } else if (caution) {
    iconContainerClass += "-caution";
  } else if (danger) {
    iconContainerClass += "-danger";
  }
  return (
    <div className="card">
      <div className={iconContainerClass}>
        <i className={icon}></i>
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <h2>{total}</h2>
      </div>
    </div>
  );
}
//style={{ fontSize: "100px" }}
