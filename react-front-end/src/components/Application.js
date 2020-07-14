import React from "react";
import "./Application.scss";
import useApplicationData from "../hooks/useApplicationData";
import SidebarList from "./SidebarList";
import Tab from "./Tab";
import * as image from "../images/logo.png";

export default function Application(props) {
  // Destructing custom hook
  const {
    state,
    setState,
    setCurrentItem,
    setWarranties,
    setRenderForm,
    setRenderEditForm,
    addItem,
    fetchItemDetails,
    deleteFile,
    updateItem,
  } = useApplicationData();

  return (
    <main className="layout">
      <section className="sidebar">
        <h1 className="sidebar__logo sidebar--centered">
          <img src={image} className="sidebar__logo-image" />
          Warden
        </h1>
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <SidebarList
            tabs={state.tabs}
            tab={state.tab}
            setState={setState}
            state={state}
          />
        </nav>
      </section>
      <section className="content">
        <Tab
          name={state.tab}
          state={state}
          setCurrentItem={setCurrentItem}
          setWarranties={setWarranties}
          setRenderForm={setRenderForm}
          setRenderEditForm={setRenderEditForm}
          addItem={addItem}
          fetchItemDetails={fetchItemDetails}
          deleteFile={deleteFile}
          updateItem={updateItem}
        />
      </section>
    </main>
  );
}
