import React from "react";
import PaymentListItem from "./PaymentListItem";

export default function PaymentList(props) {
  const paymentItems = props.payments.map((payment) => {
    return (
      <PaymentListItem
        key={payment.id}
        payment={payment}
        setCurrentItem={props.setCurrentItem}
        fetchItemDetails={props.fetchItemDetails}
      />
    );
  });
  return (
    <table className="list-with-progress">
      <thead>
        <tr>
          <th className="category">Category</th>
          <th className="name">Payment name</th>
          <th className="progress">Progress</th>
        </tr>
      </thead>
      <tbody>{paymentItems}</tbody>
    </table>
  );
}
