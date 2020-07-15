import React, { useState } from "react";
import FileList from "./FileList";
import FormTransactionList from "./FormTransactionList";
import "./Form.scss";

export default function Form(props) {
  const { addItem, setCurrentItem, deleteFile } = props;
  const { currentItem } = props;
  // const { warranty, payment } = currentItem;
  const [state, setState] = useState({
    // Initialize application state
    // Item section
    // currentItem.item.name ||
    itemName: (currentItem && currentItem.item.name) || "",
    itemCategory: (currentItem && currentItem.item.category) || "Other",
    itemDescription: (currentItem && currentItem.item.description) || "",

    // Warranty section
    warrantySectionActive: (currentItem && currentItem.warranty) || false,
    warrantyStartDate:
      (currentItem &&
        currentItem.warranty &&
        formatDate(new Date(parseInt(currentItem.warranty.start_date, 10)))) ||
      "",
    warrantyDuration:
      (currentItem &&
        currentItem.warranty &&
        currentItem.warranty.duration_in_months) ||
      "",
    warrantySmsNotification:
      (currentItem && currentItem.warranty && currentItem.warranty.sms) ||
      false,
    warrantyEmailNotification:
      (currentItem && currentItem.warranty && currentItem.warranty.email) ||
      false,
    // .sort(compareDateNewest)
    warrantyNotifyDaysPrior:
      (currentItem &&
        currentItem.warranty &&
        currentItem.warranty.days_prior) ||
      "",

    // Payment section
    paymentSectionActive: (currentItem && currentItem.payment) || false,
    paymentMonthly:
      (currentItem &&
        currentItem.payment &&
        currentItem.payment.duration_in_months) ||
      false,
    paymentStartDate:
      (currentItem &&
        currentItem.payment &&
        formatDate(new Date(parseInt(currentItem.payment.start_date, 10)))) ||
      "",
    paymentDuration:
      (currentItem &&
        currentItem.payment &&
        currentItem.payment.duration_in_months) ||
      "",
    paymentSmsNotification:
      (currentItem && currentItem.payment && currentItem.payment.sms) || false,
    paymentEmailNotification:
      (currentItem && currentItem.payment && currentItem.payment.email) ||
      false,
    paymentNotifyDaysPrior:
      (currentItem && currentItem.payment && currentItem.payment.days_prior) ||
      "",
    transactions: (currentItem && currentItem.transactions) || [],
    oldTransactions: (currentItem && currentItem.transactions) || [],
    error: "",
  });

  // Item section
  const setItemName = (itemName) => setState({ ...state, itemName });
  const setItemCategory = (itemCategory) =>
    setState({ ...state, itemCategory });
  const setItemDescription = (itemDescription) =>
    setState({ ...state, itemDescription });

  // Warranty section
  // const setWarrantySectionActive = (warrantySectionActive) =>
  //   setState({ ...state, warrantySectionActive });
  const setWarrantyStartDate = (warrantyStartDate) =>
    setState({ ...state, warrantyStartDate });
  const setWarrantyDuration = (warrantyDuration) =>
    setState({ ...state, warrantyDuration });
  const setWarrantySmsNotification = (warrantySmsNotification) =>
    setState({ ...state, warrantySmsNotification });
  const setWarrantyEmailNotification = (warrantyEmailNotification) =>
    setState({ ...state, warrantyEmailNotification });
  const setWarrantyNotifyDaysPrior = (warrantyNotifyDaysPrior) =>
    setState({ ...state, warrantyNotifyDaysPrior });

  // Payment section
  // const setPaymentSectionActive = (paymentSectionActive) =>
  //   setState({ ...state, paymentSectionActive });
  const setPaymentMonthly = (paymentMonthly) =>
    setState({ ...state, paymentMonthly });
  const setPaymentStartDate = (paymentStartDate) =>
    setState({ ...state, paymentStartDate });
  const setPaymentDuration = (paymentDuration) =>
    setState({ ...state, paymentDuration });
  const setPaymentSmsNotification = (paymentSmsNotification) =>
    setState({ ...state, paymentSmsNotification });
  const setPaymentEmailNotification = (paymentEmailNotification) =>
    setState({ ...state, paymentEmailNotification });
  const setPaymentNotifyDaysPrior = (paymentNotifyDaysPrior) =>
    setState({ ...state, paymentNotifyDaysPrior });

  const setFiles = (files) => setState({ ...state, files });
  const setTransactions = (transactions) =>
    setState({ ...state, transactions });

  const setError = (error) => setState({ ...state, error });

  const {
    itemName,
    itemCategory,
    itemDescription,
    warrantySectionActive,
    warrantyStartDate,
    warrantyDuration,
    warrantySmsNotification,
    warrantyEmailNotification,
    warrantyNotifyDaysPrior,
    paymentSectionActive,
    paymentStartDate,
    paymentDuration,
    paymentSmsNotification,
    paymentEmailNotification,
    paymentNotifyDaysPrior,
    paymentMonthly,
    files,
    transactions,
    oldTransactions,
    error,
  } = state;

  const categoryOptions = [
    "Other",
    "Personal", //
    "Transportation",
    "Grocery",
    "Entertainment",
    "Restaurants",
    "Health",
    "Sports",
    "Mobile",
    "Appliance",
    "Electronics",
    "Camera",
    //"Musical Instruments",
    "Audio",
  ].map((category, index) => {
    return <option key={index}>{category}</option>;
  });

  function validate() {
    if (itemName === "") {
      //setError("Item name cannot be blank");
      return;
    }
    if (warrantySectionActive) {
      if (!warrantyStartDate) {
        return;
      }
      if (!warrantyDuration) {
        return;
      }
      if (warrantySmsNotification || warrantyEmailNotification) {
        if (!warrantyNotifyDaysPrior) {
          return;
        }
      }
    }
    if (paymentSectionActive) {
      if (!paymentStartDate) {
        return;
      }
      if (paymentMonthly) {
        if (!paymentDuration) {
          return;
        }
      } else {
        if (transactions.length === 0) {
          setError("Transaction Cannot Be Empty");
          return;
        } else if (transactions.length > 1) {
          setError("One-Time Payment Should Only Have One Transaction");
          return;
        }
      }
    }

    if (paymentSmsNotification || paymentEmailNotification) {
      if (!paymentNotifyDaysPrior) {
        return;
      }
    }
    if (!warrantySectionActive && !paymentSectionActive) {
      return;
    }
    addItem({
      itemName,
      itemCategory,
      itemDescription,
      warrantyStartDate,
      warrantyDuration,
      warrantySmsNotification,
      warrantyEmailNotification,
      warrantyNotifyDaysPrior,
      paymentStartDate,
      paymentDuration,
      paymentSmsNotification,
      paymentEmailNotification,
      paymentNotifyDaysPrior,
      paymentMonthly,
      files,
      transactions,
      oldTransactions,
    }).then(() => {
      props.setRenderForm(false);
    });
  }

  function onSectionActiveChange(isActive, type) {
    setState({
      ...state,
      [`${type}StartDate`]: "",
      [`${type}Duration`]: "",
      [`${type}SectionActive`]: isActive,
      [`${type}EmailNotification`]: false,
      [`${type}SmsNotification`]: false,
      [`${type}NotifyDaysPrior`]: "",
      paymentMonthly: type === "payment" ? false : paymentMonthly,
    });
  }

  function onNotificationChange(isActive, isOtherActive, setNotif, type) {
    if (!isActive && !isOtherActive) {
      setState({
        ...state,
        [`${type}SmsNotification`]: false,
        [`${type}EmailNotification`]: false,
        [`${type}NotifyDaysPrior`]: "",
      });
    } else {
      setNotif(isActive);
    }
  }

  function onPaymentMonthlyChange(isActive) {
    if (!isActive) {
      setState({
        ...state,
        paymentDuration: "",
        paymentEmailNotification: false,
        paymentSmsNotification: false,
        paymentMonthly: false,
        paymentNotifyDaysPrior: "",
      });
    } else {
      setPaymentMonthly(isActive);
    }
  }

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
    <div className="form-container">
      <div className="button-section">
        <button
          onClick={(e) => props.setRenderForm(false)}
          className="button-close"
        >
          <i className="fa fa-times" aria-hidden="true"></i>
        </button>
      </div>

      <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
        {/* Item section */}
        <div className="item-section">
          <h1>Basic Info</h1>
          <div>
            <label>Name:</label>
            <br />
            <br />
            <input
              type="text"
              value={itemName}
              onChange={(event) => setItemName(event.target.value)}
              placeholder="Enter Item Name"
              required
            />
          </div>
          <div>
            <label>Category: </label>
            <br />
            <br />
            <select
              className="select-css"
              value={itemCategory}
              onChange={(event) => setItemCategory(event.target.value)}
            >
              {categoryOptions}
            </select>
          </div>
          <div>
            <label>Description:</label>
            <br />
            <br />
            <textarea
              // type="text"
              value={itemDescription}
              onChange={(event) => setItemDescription(event.target.value)}
              placeholder="Enter Description"
              rows="4"
              cols="50"
            ></textarea>
          </div>
        </div>
        {/* Warranty section */}
        <div className="entry-section">
          <input
            type="checkbox"
            name="warrantyCheckBox"
            checked={warrantySectionActive}
            onChange={(event) =>
              onSectionActiveChange(event.target.checked, "warranty")
            }
            required={!warrantySectionActive && !paymentSectionActive}
            onInvalid={(e) =>
              e.target.setCustomValidity(
                "Please tick either warranty or payment"
              )
            }
            onClick={(e) => e.target.setCustomValidity("")}
          ></input>
          <fieldset disabled={!warrantySectionActive}>
            <h1>Warranty</h1>
            <div>
              <label>Start Date:</label>
              <br />
              <br />
              <input
                type="date"
                value={warrantyStartDate}
                onChange={(event) => setWarrantyStartDate(event.target.value)}
                required={warrantySectionActive}
              />
            </div>

            <div>
              <label>Duration in months:</label>
              <br />
              <br />
              <input
                type="number"
                value={warrantyDuration}
                onChange={(event) => setWarrantyDuration(event.target.value)}
                required={warrantySectionActive}
              />
            </div>
            <div>
              <label>Notify by SMS: </label> &nbsp;&nbsp;
              <input
                type="checkbox"
                name="smsCheckBox"
                checked={warrantySmsNotification}
                onChange={(event) =>
                  onNotificationChange(
                    event.target.checked,
                    warrantyEmailNotification,
                    setWarrantySmsNotification,
                    "warranty"
                  )
                }
              />
            </div>

            <div>
              <label>Notify by E-mail: </label> &nbsp;&nbsp;
              <input
                type="checkbox"
                name="emailCheckBox"
                checked={warrantyEmailNotification}
                onChange={(event) =>
                  onNotificationChange(
                    event.target.checked,
                    warrantySmsNotification,
                    setWarrantyEmailNotification,
                    "warranty"
                  )
                }
              />
            </div>

            <div>
              <label>Notify days prior to:</label>
              <br />
              <br />
              <input
                type="number"
                value={warrantyNotifyDaysPrior}
                onChange={(event) =>
                  setWarrantyNotifyDaysPrior(event.target.value)
                }
                disabled={
                  !warrantySmsNotification && !warrantyEmailNotification
                }
                required={warrantySmsNotification || warrantyEmailNotification}
              />
            </div>
          </fieldset>
        </div>

        {/* Payment section */}
        <div className="entry-section">
          <input
            type="checkbox"
            name="paymentCheckBox"
            checked={paymentSectionActive}
            onChange={(event) =>
              onSectionActiveChange(event.target.checked, "payment")
            }
            required={!warrantySectionActive && !paymentSectionActive}
          />
          <fieldset disabled={!paymentSectionActive}>
            <h1>Payment</h1>
            <div>
              <input
                type="radio"
                checked={!paymentMonthly}
                onChange={(event) =>
                  onPaymentMonthlyChange(!event.target.checked)
                }
              />
              <label>One-time </label>
              <input
                type="radio"
                checked={paymentMonthly}
                onChange={(event) =>
                  onPaymentMonthlyChange(event.target.checked)
                }
              />
              <label>Monthly</label>
            </div>
            <div>
              <label>{paymentMonthly ? "Start Date" : "Date"}</label>
              <br />
              <br />
              <input
                type="date"
                value={paymentStartDate}
                onChange={(event) => setPaymentStartDate(event.target.value)}
                required={paymentSectionActive}
              />
            </div>

            <div>
              <label>Duration in months:</label>
              <br />
              <br />
              <input
                type="number"
                value={paymentDuration}
                onChange={(event) => setPaymentDuration(event.target.value)}
                required={paymentMonthly}
                disabled={!paymentMonthly}
              />
            </div>

            <div>
              <label>Notify by SMS: </label> &nbsp;&nbsp;
              <input
                type="checkbox"
                name="smsCheckBox"
                checked={paymentSmsNotification}
                onChange={(event) =>
                  onNotificationChange(
                    event.target.checked,
                    paymentEmailNotification,
                    setPaymentSmsNotification,
                    "payment"
                  )
                }
                disabled={!paymentMonthly}
              />
            </div>

            <div>
              <label>Notify by E-mail: </label> &nbsp;&nbsp;
              <input
                type="checkbox"
                name="emailCheckBox"
                checked={paymentEmailNotification}
                onChange={(event) =>
                  onNotificationChange(
                    event.target.checked,
                    paymentSmsNotification,
                    setPaymentEmailNotification,
                    "payment"
                  )
                }
                disabled={!paymentMonthly}
              />
            </div>

            <div>
              <label>Notify days prior to:</label>
              <br />
              <br />
              <input
                type="number"
                value={paymentNotifyDaysPrior}
                onChange={(event) =>
                  setPaymentNotifyDaysPrior(event.target.value)
                }
                disabled={!paymentSmsNotification && !paymentEmailNotification}
                required={paymentSmsNotification || paymentEmailNotification}
              />
            </div>
          </fieldset>
        </div>

        <div>
          <h1>Transactions</h1>
          <p>{error}</p>
          <FormTransactionList
            transactions={transactions}
            setTransactions={setTransactions}
            setError={setError}
          />
        </div>

        <div className="file-section">
          <h1>Files</h1>
          <FileList
            currentItem={currentItem}
            setCurrentItem={setCurrentItem}
            files={files}
            deleteFile={deleteFile}
          />

          <label for="files" className="button-upload">
            <i class="fa fa-file"></i>&nbsp;&nbsp;Add Files
          </label>

          <input
            id="files"
            type="file"
            files={files}
            multiple
            onChange={(event) => setFiles(event.target.files)}
          />
        </div>

        <input
          className="save-section"
          type="submit"
          onClick={validate}
          value={currentItem ? "Update" : "Save"}
        />
      </form>
    </div>
  );
}
