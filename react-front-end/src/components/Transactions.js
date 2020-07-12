import React, { useState, useEffect } from "react";
import FormTransactionList from "./FormTransactionList";
// import TransactionOrderBy from "./TransactionOrderBy";
import TransactionDashboard from "./TransactionDashboard";
import TransactionSearch from "./TransactionSearch";

export default function Transactions(props) {
  const [state, setState] = useState({
    term: "",
    // categoryFilter: "All",
    orderBy: "Newest",
    displayedTransactions: [],
    transactions: [],
    searchResult: [],
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      displayedTransactions: props.transactions,
      transactions: props.transactions,
      searchResult: props.transactions,
    }));
  }, [props.transactions]);

  return (
    <div>
      <TransactionDashboard transactions={state.transactions} />
      <TransactionSearch state={state} setState={setState} />
      {/* <CategoryFilter state={state} setState={setState} /> */}
      {/* setCategoryFilter={setCategoryFilter} */}
      {/* <TransactionOrderBy state={state} setState={setState} /> */}

      <button onClick={(e) => props.setRenderForm(true)}>
        <i className="fa fa-plus" aria-hidden="true"></i>
      </button>
      {/* <WarrantyList
        warranties={state.displayedWarranties}
        setCurrentItem={props.setCurrentItem}
        fetchItemDetails={props.fetchItemDetails}
      /> */}
      <FormTransactionList
        transactions={state.displayedTransactions}
        fetchItemDetails={props.fetchItemDetails}
      />
      {/* {warrantyItems} */}
      {/* {props.warranties.map((warranty) => (
        <WarrantyListItem warranty={warranty} />
      ))} */}
    </div>
  );
}
