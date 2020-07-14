import React from "react";

export default function DownloadFileListItem(props) {
  const { id, name } = props;

  return (
    <div className="file-link-container">
      <a href={`http://localhost:8080/api/files/${id}`} download>
        {name} <i className="fa fa-download" aria-hidden="true"></i>
      </a>
    </div>
  );
}
