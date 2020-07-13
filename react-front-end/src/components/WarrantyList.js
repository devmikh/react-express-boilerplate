import React from "react";
import WarrantyListItem from "./WarrantyListItem";

export default function Warranties(props) {
  const warrantyItems = props.warranties.map((warranty) => {
    return (
      <WarrantyListItem
        key={warranty.id}
        warranty={warranty}
        setCurrentItem={props.setCurrentItem}
        fetchItemDetails={props.fetchItemDetails}
      />
    );
  });
  return (
    <table className="list-with-progress">
      <thead>
        <tr>
          <th className="category">Category</th>
          <th className="name">Warranty name</th>
          <th className="progress">Progress</th>
        </tr>
      </thead>
      <tbody>{warrantyItems}</tbody>
    </table>
  );
}
