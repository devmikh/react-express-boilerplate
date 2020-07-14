import React, { useEffect } from "react";
import DownloadFileList from "./DownloadFileList";
import FormTransactionList from "./FormTransactionList";
import "./ItemDetails.scss";

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
    <div className="item-details-container">
      <div className="button-section">
        <button
          onClick={(e) => props.setCurrentItem(null)}
          className="button-close"
        >
          <i className="fa fa-times" aria-hidden="true"></i>
        </button>
        <button
          onClick={(e) => props.setRenderEditForm(true)}
          className="button-add"
        >
          <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
          <span>Edit</span>
        </button>
      </div>

      {/* Item */}

      <div className="item-section">
        <h1>Basic Info</h1>
        <div className="name-category-container">
          <h2>{item.name}</h2>
          <h2>Category: {item.category}</h2>
        </div>
        <div className="description">
          <h2>Description:</h2>
          <p className="description-text">
            {item.description ? item.description : "N/A"}
          </p>
        </div>
      </div>
      {/* Warranty */}
      {currentItem.warranty && (
        <div className="entry-section">
          <h1>Warranty</h1>
          <div className="entry-date-container">
            <span>Start Date:</span>
            <br />
            <br />
            <span>
              {formatDate(
                new Date(parseInt(currentItem.warranty.start_date, 10))
              )}
            </span>
          </div>
          <div>
            <span>Duration in Months:</span>
            <br />
            <p>{currentItem.warranty.duration_in_months}</p>
          </div>

          <p>
            Notify by sms: <br /> {currentItem.warranty.sms ? "✔" : "❌"}
          </p>
          <p>
            Notify by email: <br /> {currentItem.warranty.email ? "✔" : "❌"}
          </p>
          {(currentItem.warranty.sms || currentItem.warranty.email) && (
            <p>
              Notify days prior to: <br /> {currentItem.warranty.days_prior}
            </p>
          )}
        </div>
      )}
      {/* Payment */}
      {currentItem.payment && (
        <div className="entry-section">
          <h1>Payment</h1>
          <div className="entry-date-container">
            <span>Start Date:</span>
            <br />
            <br />
            <span>
              {formatDate(
                new Date(parseInt(currentItem.payment.start_date, 10))
              )}
            </span>
          </div>
          <div>
            <p>
              {currentItem.payment.duration_in_months !== 0 ? (
                <span>
                  Duration in Months:
                  <br />
                  {currentItem.payment.duration_in_months}
                </span>
              ) : (
                <p>One-Time Payment</p>
              )}
              {/* {currentItem.payment.duration_in_months === 0
                ? "One-Time Payment"
                :
               
                 currentItem.payment.duration_in_months} */}
            </p>
          </div>

          <p>
            Notify by sms: <br />
            {currentItem.payment.sms ? "✔" : "❌"}
          </p>
          <p>
            Notify by email: <br /> {currentItem.payment.email ? "✔" : "❌"}
          </p>
          {(currentItem.payment.sms || currentItem.payment.email) && (
            <p>
              Notify days prior to: <br /> {currentItem.payment.days_prior}
            </p>
          )}
        </div>
      )}
      {/* TransactionList */}
      {currentItem.transactions.length > 0 && (
        <div className="transaction-section">
          <h1>Transactions</h1>
          <FormTransactionList transactions={currentItem.transactions} />
        </div>
      )}

      {/* FileList */}
      {filesDB.length > 0 && (
        <div className="file-section">
          <h1>Files</h1>
          <DownloadFileList filesDB={filesDB} />
        </div>
      )}
    </div>
  );
}
