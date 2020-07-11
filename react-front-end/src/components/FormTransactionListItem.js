import React from "react";

export default function FormTransactionListItem(props) {
  function formatDate(date) {
    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();

    return [
      date.getFullYear(),
      (mm > 9 ? "" : "0") + mm,
      (dd > 9 ? "" : "0") + dd,
    ].join("-");
  }
  return (
    <tr>
      <td>{formatDate(new Date(parseInt(props.transaction.date, 10)))}</td>

      <td>{props.transaction.name}</td>
      <td>{props.transaction.amount}</td>
      {props.onDelete && (
        <td>
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log("before ondelete");
              props.onDelete(props.transaction.name, props.transaction.amount);
              console.log("after ondelete");
            }}
          >
            <i className="fa fa-trash" aria-hidden="true"></i>
          </button>
        </td>
      )}
    </tr>
  );
}
