import React, { useEffect } from "react";
import UserProfile from "./UserProfile";
import Warranties from "./Warranties";
import Form from "./Form";
import ItemDetails from "./ItemDetails";

export default function Tab(props) {
  if (props.state.currentItem === null) {
    if (props.state.renderForm) {
      return (
        <Form setRenderForm={props.setRenderForm} addItem={props.addItem} />
      );
    }
    switch (props.name) {
      case "User Profile":
        return <UserProfile userData={props.state.userData[0]} />;
      case "Warranties":
        return (
          <Warranties
            warranties={props.state.warranties}
            setCurrentItem={props.setCurrentItem}
            setWarranties={props.setWarranties}
            setRenderForm={props.setRenderForm}
            fetchItemDetails={props.fetchItemDetails}
          />
        );
      case "Monthly Payments":
        // return <Payments />;
        return <p>{props.name}</p>;
      case "Transactions":
        // return <Transactions />;
        return <p>{props.name}</p>;
      default:
        return;
    }
  } else {
    if (props.state.renderEditForm) {
      return (
        <Form
          setRenderForm={props.setRenderEditForm}
          currentItem={props.state.currentItem}
          setCurrentItem={props.setCurrentItem}
          deleteFile={props.deleteFile}
          addItem={props.updateItem}
          fetchItemDetails={props.fetchItemDetails}
          state={props.state}
        />
      );
    }
    // useEffect(() => {
    //   props.fetchItemDetails(props.state.currentItem.id);
    // }, []);
    return (
      <ItemDetails
        currentItem={props.state.currentItem}
        setCurrentItem={props.setCurrentItem}
        setRenderEditForm={props.setRenderEditForm}
        fetchItemDetails={props.fetchItemDetails}
      />
    );
    // return <p>{props.state.currentItem.name}</p>;
  }
}
