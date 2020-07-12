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
    <div>
      <PaymentDashboard
        payments={props.payments}
        transactions={props.transactions}
      />
      <PaymentSearch state={state} setState={setState} />
      <PaymentCategoryFilter state={state} setState={setState} />
      {/* setCategoryFilter={setCategoryFilter} */}
      <PaymentOrderBy state={state} setState={setState} />

      <button onClick={(e) => props.setRenderForm(true)}>
        <i className="fa fa-plus" aria-hidden="true"></i>
      </button>
      <PaymentList
        payments={state.displayedPayments}
        setCurrentItem={props.setCurrentItem}
        fetchItemDetails={props.fetchItemDetails}
      />
      {/* {warrantyItems} */}
      {/* {props.warranties.map((warranty) => (
        <WarrantyListItem warranty={warranty} />
      ))} */}
    </div>
  );
}
