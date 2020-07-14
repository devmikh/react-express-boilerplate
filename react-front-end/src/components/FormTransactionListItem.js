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
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
  return (
    <tr>
      <td>{formatDate(new Date(parseInt(props.transaction.date, 10)))}</td>

      <td>{props.transaction.name}</td>
      <td>{formatter.format(props.transaction.amount)}</td>
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
      {props.fetchItemDetails && (
        <td>
          <button
            className="button-info"
            onClick={(e) =>
              props.fetchItemDetails(props.transaction.item_id, false)
            }
          >
            <i className="fa fa-info" aria-hidden="true"></i>
          </button>
        </td>
      )}
    </tr>
  );
}
