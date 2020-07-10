import React, { useEffect } from "react";

export default function ItemDetails(props) {
  useEffect(() => {
    props.fetchItemDetails(props.currentItem.id);
  }, []);

  return (
    <div>
      <button onClick={(e) => props.setCurrentItem(null)}>
        <i className="fa fa-times" aria-hidden="true"></i>
      </button>
      <button onClick={(e) => props.setRenderEditForm(true)}>
        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
      </button>
      <p>{props.currentItem.message}</p>
    </div>
  );
}
