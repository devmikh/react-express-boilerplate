import React, { useState } from "react";

export default function AddTransactionForm(props) {
  // const [addMode, setAddMode] = useState(true);

  const [state, setState] = useState({
    addMode: true,
    transactionDate: "",
    transactionName: "",
    transactionAmount: "",
  });

  const {
    addMode,
    transactionDate,
    transactionName,
    transactionAmount,
  } = state;

  // function compareDateNewest(a, b) {
  //   if (parseInt(a.date, 10) > parseInt(b.date, 10)) return -1;
  //   if (parseInt(b.date, 10) > parseInt(a.date, 10)) return 1;

  //   return 0;
  // }

  function saveTransaction() {
    const transaction = {
      name: transactionName,
      amount: parseInt(transactionAmount, 10),
      date: (new Date(transactionDate).getTime() + 25200001).toString(),
    };

    // let transactionList = [...props.currentItem.transactions, transaction].sort(
    //   compareDateNewest
    // );
    // let transactionList = [];
    // if (props.currentItem) {
    //   transactionList =  [...props.currentItem.transactions, transaction].sort(
    //       compareDateNewest
    //     )
    // }else {
    //   transactionList.push(transaction)
    // }
    const includesArr = props.transactions.filter((trans) => {
      return (
        trans.name === transaction.name &&
        trans.amount === transaction.amount &&
        trans.date === transaction.date
      );
    });

    if (includesArr.length > 0) {
      props.setError("You Cannot Create Duplicate Transactions");
      return;
    }

    props.setTransactions([...props.transactions, transaction]);
    setState({
      addMode: true,
      transactionDate: "",
      transactionName: "",
      transactionAmount: "",
    });
  }

  if (addMode) {
    return (
      <tr>
        <i
          class="fa fa-plus-circle"
          aria-hidden="true"
          onClick={(e) => setState({ ...state, addMode: false })}
        ></i>
      </tr>
    );
  } else {
    return (
      <tr>
        <td>
          <input
            type="date"
            value={transactionDate}
            onChange={(e) => {
              setState({ ...state, transactionDate: e.target.value });
            }}
          />
        </td>
        <td>
          <input
            type="text"
            value={transactionName}
            onChange={(e) => {
              setState({ ...state, transactionName: e.target.value });
            }}
          />
        </td>
        <td>
          <input
            type="number"
            value={transactionAmount}
            onChange={(e) => {
              setState({ ...state, transactionAmount: e.target.value });
            }}
          />
        </td>
        <td>
          <i
            class="fa fa-plus"
            aria-hidden="true"
            onClick={saveTransaction}
          ></i>
        </td>
      </tr>
    );
  }
}
