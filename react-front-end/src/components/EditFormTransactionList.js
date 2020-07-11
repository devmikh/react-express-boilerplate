import React, { useState } from "react";
import FormTransactionListItem from "./FormTransactionListItem";
import AddTransactionForm from "./AddTransactionForm";
import FormTransactionList from "./FormTransactionList";

export default function EditFormTransactionList(props) {
  const [localTransactions, setLocalTransactions] = useState([]);
  return (
    <FormTransactionList
      transactions={localTransactions}
      setLocalTransactions={setLocalTransactions}
    />
  );
}
