import React, { useState, useEffect } from "react";
import PaymentList from "./PaymentList";
import PaymentCategoryFilter from "./PaymentCategoryFilter";
import PaymentSearch from "./PaymentSearch";
import PaymentOrderBy from "./PaymentOrderBy";
import PaymentDashboard from "./PaymentDashboard";

export default function Payments(props) {
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
    displayedPayments: [],
    payments: [],
    searchResult: [],

    // loading: false,
  });
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      displayedPayments: props.payments,
      payments: props.payments,
      searchResult: props.payments,
    }));
    // console.log(state.displayedWarranties);
  }, [props.payments]);
  // console.log("Warranties.js rerender");
  return (
    <div className="tab">
      <PaymentDashboard
        payments={props.payments}
        transactions={props.transactions}
      />
      <div className="search-filter-container">
        <PaymentSearch state={state} setState={setState} />
        <div className="filter-container">
          <PaymentCategoryFilter state={state} setState={setState} />
          <PaymentOrderBy state={state} setState={setState} />
        </div>
      </div>
      <button className="button-add" onClick={(e) => props.setRenderForm(true)}>
        <i className="fa fa-plus" aria-hidden="true"></i>
        <span>Add Item</span>
      </button>
      <PaymentList
        payments={state.displayedPayments}
        setCurrentItem={props.setCurrentItem}
        fetchItemDetails={props.fetchItemDetails}
      />
    </div>
  );
}
