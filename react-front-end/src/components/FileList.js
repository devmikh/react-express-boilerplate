import React from "react";
import FileListItem from "./FileListItem";

export default function FileList(props) {
  const { files, currentItem, setCurrentItem, deleteFile } = props;

  const setFilesDB = (filesDB) => setCurrentItem({ ...currentItem, filesDB });

  const fileListItems = [];
  //var fileListItems = ['three', 'seven', 'eleven'];
  //fileListItems.remove('filename');

  function onDelete(id) {
    console.log("before delete file");
    deleteFile(id).then((res) => {
      console.log("delete success");
      setFilesDB(
        currentItem.filesDB.filter((file) => {
          return file.id !== id;
        })
      );
    });

    // setCurrentItem({ ...currentItem, filesDB: [] });
  }

  if (currentItem) {
    currentItem.filesDB.forEach((file) => {
      fileListItems.push(
        <FileListItem
          key={file.id}
          id={file.id}
          name={file.name}
          onDelete={onDelete}
        />
      );
    });
  }

  for (let key in files) {
    if (files[key] instanceof File) {
      fileListItems.push(<FileListItem name={files[key].name} />);
    }
  }

  return <div>{fileListItems}</div>;
}
