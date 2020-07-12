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
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Payment name</th>
          <th>Progress</th>
        </tr>
      </thead>
      <tbody>{paymentItems}</tbody>
    </table>
  );
}
