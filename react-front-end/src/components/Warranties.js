import React, { useState, useEffect } from "react";
import WarrantyList from "./WarrantyList";
import CategoryFilter from "./CategoryFilter";
import Search from "./Search";
import OrderBy from "./OrderBy";
import WarrantyDashboard from "./WarrantyDashboard";
import "./Tab.scss";

export default function Warranties(props) {
  // const warrantyItems = props.warranties.map((warranty) => {
  //   return <WarrantyListItem key={warranty.id} warranty={warranty} />;
  // {categoryFilter , setCategoryFilter , orderBy , setOrderBy} = useState
  // });
  // const [categoryFilter, setCategoryFilter] = useState();
  // const [orderBy, setOrderBy] = useState({
  //     term: "",
  //       results: [],
  //       loading: false,
  //     });
  // console.log(props.warranties);

  const [state, setState] = useState({
    term: "",
    categoryFilter: "All",
    orderBy: "Newest",
    displayedWarranties: [],
    warranties: [],
    searchResult: [],

    // loading: false,
  });
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      displayedWarranties: props.warranties,
      warranties: props.warranties,
      searchResult: props.warranties,
    }));
    // console.log(state.displayedWarranties);
  }, [props.warranties]);
  // console.log("Warranties.js rerender");
  return (
    <div className="tab">
      <WarrantyDashboard warranties={state.warranties} />
      <div className="search-filter-container">
        <Search state={state} setState={setState} />
        <div className="filter-container">
          <CategoryFilter state={state} setState={setState} />
          <OrderBy state={state} setState={setState} />
        </div>
      </div>

      <button className="button-add" onClick={(e) => props.setRenderForm(true)}>
        <i className="fa fa-plus" aria-hidden="true"></i>
        <span>Add Item</span>
      </button>
      <WarrantyList
        warranties={state.displayedWarranties}
        setCurrentItem={props.setCurrentItem}
        fetchItemDetails={props.fetchItemDetails}
      />
    </div>
  );
}
