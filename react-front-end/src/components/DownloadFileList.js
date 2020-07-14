import React from "react";
import DownloadFileListItem from "./DownloadFileListItem";

export default function DownloadFileList(props) {
  const { filesDB } = props;

  const downloadFileListItems = [];

  filesDB.forEach((file) => {
    downloadFileListItems.push(
      <DownloadFileListItem key={file.id} id={file.id} name={file.name} />
    );
  });

  return (
    <div>
      {/* <p>Files</p> */}
      {downloadFileListItems}
    </div>
  );
}
