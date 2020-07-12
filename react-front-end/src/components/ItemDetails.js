import React, { useEffect } from "react";
import DownloadFileList from "./DownloadFileList";
import FormTransactionList from "./FormTransactionList";

export default function ItemDetails(props) {
  const { currentItem, setCurrentItem } = props;
  const { item } = currentItem;
  const { filesDB } = currentItem;
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
    <div>
      <button onClick={(e) => props.setCurrentItem(null)}>
        <i className="fa fa-times" aria-hidden="true"></i>
      </button>
      <button onClick={(e) => props.setRenderEditForm(true)}>
        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
      </button>
      {/* Item */}
      <div style={{ border: "2px solid black" }}>
        <h2>{item.name}</h2>
        <h2>{item.category}</h2>
        <h2>{item.description}</h2>
      </div>
      {/* Warranty */}
      {currentItem.warranty && (
        <div style={{ border: "2px solid black" }}>
          <h1>Warranty</h1>
          <p>
            {formatDate(
              new Date(parseInt(currentItem.warranty.start_date, 10))
            )}
          </p>
          <p>{currentItem.warranty.duration_in_months}</p>
          <p>Notify by sms: {currentItem.warranty.sms ? "Yes" : "No"}</p>
          <p>Notify by email: {currentItem.warranty.email ? "Yes" : "No"}</p>
        </div>
      )}
      {/* Payment */}
      {currentItem.payment && (
        <div style={{ border: "2px solid black" }}>
          <h1>Payment</h1>
          <p>
            {formatDate(new Date(parseInt(currentItem.payment.start_date, 10)))}
          </p>
          <p>
            {currentItem.payment.duration_in_months === 0
              ? "One-Time"
              : currentItem.payment.duration_in_months}
          </p>
          <p>Notify by sms: {currentItem.payment.sms ? "Yes" : "No"}</p>
          <p>Notify by email: {currentItem.payment.email ? "Yes" : "No"}</p>
        </div>
      )}
      {/* TransactionList */}
      {currentItem.transactions.length > 0 && (
        <div style={{ border: "2px solid black" }}>
          <h1>Transactions</h1>
          <FormTransactionList transactions={currentItem.transactions} />
        </div>
      )}

      {/* FileList */}
      {filesDB.length > 0 && (
        <div style={{ border: "2px solid black" }}>
          <h1>Files</h1>
          <DownloadFileList filesDB={filesDB} />
        </div>
      )}
    </div>
  );
}
