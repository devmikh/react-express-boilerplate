import React from "react";

export default function DownloadFileListItem(props) {
  const { id, name } = props;

  return (
    <div>
      <a href={`http://localhost:8080/api/files/${id}`} download>
        {name}
        <i class="fa fa-download" aria-hidden="true"></i>
      </a>
    </div>
  );
}
