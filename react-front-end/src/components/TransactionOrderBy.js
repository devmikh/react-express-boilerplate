import React, { useEffect } from "react";

export default function TransactionOrderBy(props) {
  const { state, setState } = props;

  function compareDateNewest(a, b) {
    if (parseInt(a.date, 10) > parseInt(b.date, 10)) {
      console.log("date newest -1");
      return -1;
    }
    if (parseInt(b.date, 10) > parseInt(a.date, 10)) {
      console.log("date newest 1");
      return 1;
    }
    console.log("date newest 0");
    return 0;
  }
  function compareDateOldest(a, b) {
    if (parseInt(a.date, 10) > parseInt(b.date, 10)) {
      console.log("date oldest 1");
      return 1;
    }
    if (parseInt(b.date, 10) > parseInt(a.date, 10)) {
      console.log("date oldest -1");
      return -1;
    }

    console.log("date oldest 0");
    return 0;
  }
  function compareAmountSmallest(a, b) {
    if (a.amount > b.amount) return 1;
    if (b.amount > a.amount) return -1;

    return 0;
  }
  function compareAmountLargest(a, b) {
    if (a.amount > b.amount) return -1;
    if (b.amount > a.amount) return 1;

    return 0;
  }

  // const sorted = state.displayedWarranties.sort(compareDateNewest);
  // console.log(sorted);

  useEffect(() => {
    // let list = state.transactions.map((transaction) =>
    //   parseInt(transaction.date, 10)
    // );
    let list = [1, 7, 10, 4, 5];
    console.log(list.sort((a, b) => b - a));

    // console.log(list);
    // console.log(list.sort(compare));
    function compare(a, b) {
      if (a < b) {
        return 1;
      }
      if (a > b) {
        return -1;
      }
      // a must be equal to b
      return 0;
    }

    let sorted = [...state.displayedTransactions];
    switch (state.orderBy) {
      case "Newest":
        // state.displayedTransactions.sort((a, b) => a.amount - b.amount);
        //state.displayedTransactions.sort(compareDateNewest);
        sorted.sort(compareDateNewest);

        // console.log(state.displayedTransactions.sort(compareDateOldest));
        break;
      case "Oldest":
        // state.displayedTransactions.sort(compareDateOldest);
        // console.log(sorted);
        sorted.sort(compareDateOldest);
        break;
      case "Amount ↑":
        // state.displayedTransactions.sort(compareAmountLargest);
        // console.log(sorted);

        break;
      case "Amount ↓":
        // state.displayedTransactions.sort(compareAmountSmallest);
        // console.log(sorted);
        break;
      // case `Months left ↑`:
      //   sorted = state.displayedWarranties.sort(compareMonthsLeftSmallest);
      //   break;
      // case `Months left ↓`:
      //   sorted = state.displayedWarranties.sort(compareMonthsLeftLargest);
      //   break;
      default:
    }

    console.log(state.displayedTransactions);

    setState((state) => ({
      ...state,
      displayedTransactions: sorted,
    }));
  }, [state.orderBy, state.searchResult]);

  return (
    <div>
      <label>Order By: </label>
      <select
        value={state.orderBy}
        onChange={(event) =>
          setState({ ...state, orderBy: event.target.value })
        }
      >
        <option> Newest </option>
        <option> Oldest </option>
        <option> Amount ↑</option>
        <option> Amount ↓</option>
      </select>
    </div>
  );
}
