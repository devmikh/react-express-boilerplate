import React from "react";

export default function FileListItem(props) {
  const { id, name, onDelete } = props;

  return (
    <div>
      <p>{name}</p>
      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(id);
          }}
        >
          <i className="fa fa-trash" aria-hidden="true"></i>
        </button>
      )}
    </div>
  );
}
