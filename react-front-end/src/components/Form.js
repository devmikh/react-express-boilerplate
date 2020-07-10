import React, { useState } from "react";
import FileList from "./FileList";

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

  //const setError = (error) => setState({ ...state, error });

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
    //error,
  } = state;

  const categoryOptions = [
    "Other",
    "Personal and Household",
    "Transportation",
    "Grocery and Retail",
    "Hotels, Entertainment, and Recreation",
    "Restaurants",
    "Health and Education",
    "Sports Equipment",
    "Mobile",
    "Appliance",
    "Electronics",
    "Camera",
    "Musical Instruments",
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
    if (paymentSectionActive)
      if (!paymentStartDate) {
        return;
      }
    if (paymentMonthly) {
      if (!paymentDuration) {
        return;
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
    }).then(() => {
      // if (currentItem) {
      //   props.fetchItemDetails(currentItem.id).then(() => {
      //     props.setRenderForm(false);
      //   });
      // } else {
      props.setRenderForm(false);
      // }

      // console.log(
      //   "after set render form in form.js",
      //   props.state.renderEditForm
      // );
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
    <div>
      <button onClick={(e) => props.setRenderForm(false)}>
        <i className="fa fa-times" aria-hidden="true"></i>
      </button>
      <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
        {/* Item section */}
        <label>Name:</label>
        <input
          type="text"
          value={itemName}
          onChange={(event) => setItemName(event.target.value)}
          placeholder="Enter Item Name"
          required
        ></input>
        <label>Category: </label>
        <select
          value={itemCategory}
          onChange={(event) => setItemCategory(event.target.value)}
        >
          {categoryOptions}
        </select>
        <label>Description:</label>
        <input
          type="text"
          value={itemDescription}
          onChange={(event) => setItemDescription(event.target.value)}
          placeholder="Enter Description"
        ></input>

        {/* Warranty section */}
        <input
          type="checkbox"
          name="warrantyCheckBox"
          checked={warrantySectionActive}
          onChange={(event) =>
            onSectionActiveChange(event.target.checked, "warranty")
          }
          required={!warrantySectionActive && !paymentSectionActive}
          onInvalid={(e) =>
            e.target.setCustomValidity("Please tick either warranty or payment")
          }
          onClick={(e) => e.target.setCustomValidity("")}
        ></input>
        <fieldset disabled={!warrantySectionActive}>
          <h3>Warranty</h3>
          <label>Start Date:</label>
          <input
            type="date"
            value={warrantyStartDate}
            onChange={(event) => setWarrantyStartDate(event.target.value)}
            required={warrantySectionActive}
          />
          <label>Duration in months:</label>
          <input
            type="number"
            value={warrantyDuration}
            onChange={(event) => setWarrantyDuration(event.target.value)}
            required={warrantySectionActive}
          />
          <label>Notifications</label>
          <label>SMS: </label>
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
          <label>E-mail: </label>
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
          <input
            type="number"
            value={warrantyNotifyDaysPrior}
            onChange={(event) => setWarrantyNotifyDaysPrior(event.target.value)}
            disabled={!warrantySmsNotification && !warrantyEmailNotification}
            required={warrantySmsNotification || warrantyEmailNotification}
          />
        </fieldset>

        {/* Payment section */}
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
          <h3>Payment</h3>
          <input
            type="radio"
            checked={!paymentMonthly}
            onChange={(event) => onPaymentMonthlyChange(!event.target.checked)}
          />
          <label>One-time</label>
          <input
            type="radio"
            checked={paymentMonthly}
            onChange={(event) => onPaymentMonthlyChange(event.target.checked)}
          />
          <label>Monthly</label>

          <label>{paymentMonthly ? "Start Date" : "Date"}</label>
          <input
            type="date"
            value={paymentStartDate}
            onChange={(event) => setPaymentStartDate(event.target.value)}
            required={paymentSectionActive}
          />
          <label>Duration in months:</label>
          <input
            type="number"
            value={paymentDuration}
            onChange={(event) => setPaymentDuration(event.target.value)}
            required={paymentMonthly}
            disabled={!paymentMonthly}
          />
          <label>Notifications</label>
          <label>SMS: </label>
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
          <label>E-mail: </label>
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
          <input
            type="number"
            value={paymentNotifyDaysPrior}
            onChange={(event) => setPaymentNotifyDaysPrior(event.target.value)}
            disabled={!paymentSmsNotification && !paymentEmailNotification}
            required={paymentSmsNotification || paymentEmailNotification}
          />
        </fieldset>
        <FileList
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
          files={files}
          deleteFile={deleteFile}
        />
        <input
          type="file"
          files={files}
          multiple
          onChange={(event) => setFiles(event.target.files)}
        />
        <input
          type="submit"
          onClick={validate}
          value={currentItem ? "Update" : "Save"}
        />
      </form>
    </div>
  );
}
