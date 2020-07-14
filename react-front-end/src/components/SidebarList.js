import React from "react";
import SidebarListItem from "./SidebarListItem";

export default function SidebarList(props) {
  const icon = [
    "fa fa-book",
    "fa fa-credit-card",
    "fa fa-money",
    "fa fa-address-book-o",
  ];
  const sidebarItems = props.tabs.map((tab, index) => {
    return (
      <SidebarListItem
        key={index}
        name={tab}
        selected={tab === props.tab}
        state={props.state}
        setState={props.setState}
        icon={icon[index]}
      />
    );
  });

  return sidebarItems;
}
