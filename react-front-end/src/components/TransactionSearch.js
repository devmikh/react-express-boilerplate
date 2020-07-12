import React, { Fragment, useEffect, useRef } from "react";

import SearchBar from "./SearchBar";

export default function TransactionSearch(props) {
  const { state, setState } = props;

  const prev = useRef("");

  useEffect(() => {
    if (prev.current === "" && state.term === "") return;

    setState((prev) => ({
      ...prev,
      loading: true,
    }));

    prev.current = state.term;
    const result = state.transactions.filter(({ name }) =>
      name.includes(state.term)
    );
    // const filteredResult = result.filter(({ item_category }) => {
    //   if (state.categoryFilter === "All") {
    //     return true;
    //   }
    //   return item_category === state.categoryFilter;
    // });

    setState((state) => ({
      ...state,
      displayedTransactions: result,
      searchResult: result,
    }));
  }, [state.term]);

  return (
    <Fragment>
      <SearchBar onSearch={(term) => setState({ ...state, term })} />
    </Fragment>
  );
}
