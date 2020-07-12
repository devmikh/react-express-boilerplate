import React, { Fragment, useEffect, useRef } from "react";

import SearchBar from "./SearchBar";

export default function PaymentSearch(props) {
  const { state, setState } = props;

  const prev = useRef("");

  useEffect(() => {
    if (prev.current === "" && state.term === "") return;

    setState((prev) => ({
      ...prev,
      loading: true,
    }));

    prev.current = state.term;
    const result = state.payments.filter(({ item_name }) =>
      item_name.includes(state.term)
    );
    const filteredResult = result.filter(({ item_category }) => {
      if (state.categoryFilter === "All") {
        return true;
      }
      return item_category === state.categoryFilter;
    });

    setState((state) => ({
      ...state,
      displayedPayments: filteredResult,
      searchResult: result,
    }));
  }, [state.term]);

  return (
    <Fragment>
      <SearchBar onSearch={(term) => setState({ ...state, term })} />
    </Fragment>
  );
}
