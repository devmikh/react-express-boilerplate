import React from "react";

export default function FileListItem(props) {
  const { id, name, onDelete } = props;

  return (
    <div style={{ marginBottom: "20px", fontSize: "26px" }}>
      <span>{name}</span>
      {onDelete && (
        <button
          className="button-delete-file"
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
