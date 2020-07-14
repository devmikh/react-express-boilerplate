import React, { useEffect } from "react";
import { VictoryPie, VictoryTheme } from "victory";
import Card from "./Card";
import "./Dashboard.scss";

export default function PaymentDashboard(props) {
  const { payments, transactions } = props;
  // Pie logic
  let categories = payments.map((payment) => {
    return payment.item_category;
  });
  let filteredCategories = categories.filter(
    (category, index) => categories.indexOf(category) === index
  );
  let dataObj = {};
  filteredCategories.forEach((category) => (dataObj[category] = 0));

  payments.forEach((payment) => {
    dataObj[payment.item_category]++;
  });
  let data = [];
  for (let category in dataObj) {
    data.push({ x: category, y: dataObj[category] });
  }
  // // Card logic
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }
  function monthDiffFromNow(d1) {
    return monthDiff(new Date(parseInt(d1, 10)), new Date(Date.now()));
  }
  function currentMonthUnPaid(payment, transactions) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const day = new Date(parseInt(payment.start_date, 10)).getDate();
    const previousMonthDueDate = new Date(
      `${year}-${month === 0 ? 12 : month}-${day}`
    );
    console.log("previousMonthDueDate: ", previousMonthDueDate);

    const transactionsBelongToPayment = transactions.filter((transaction) => {
      return transaction.entry_id === payment.id;
    });
    console.log("Belong", transactionsBelongToPayment);

    const transactionPaidForThisMonth = transactionsBelongToPayment.filter(
      (transaction) => {
        return new Date(parseInt(transaction.date, 10)) > previousMonthDueDate;
      }
    );
    console.log(transactionPaidForThisMonth);

    let unpaid = 0;
    if (
      transactionPaidForThisMonth.length === 0 &&
      transactionsBelongToPayment.length > 0
    ) {
      unpaid += transactionsBelongToPayment[0].amount;
    }
    return unpaid;
  }

  function calculateTotalUnpaidForThisMonth() {
    let total = 0;

    payments.forEach((payment) => {
      total += currentMonthUnPaid(payment, transactions);
    });

    return total;
  }
  // useEffect(() => {
  //   // console.log(formatter.format(calculateTotalUnpaidForThisMonth()));
  // }, [payments, transactions]);

  return (
    <div className="dashboard">
      <div className="dashboard-chart-container">
        <VictoryPie
          data={data}
          height={260}
          style={{ width: "50%" }}
          theme={VictoryTheme.material}
        />
      </div>

      <Card
        title="Total Payments"
        total={payments.length}
        icon={"fa fa-credit-card fa-5x"}
      />

      <Card
        title="Total Unpaid This Month"
        total={formatter.format(calculateTotalUnpaidForThisMonth())}
        icon={"fa fa-usd fa-5x"}
        caution
      />
    </div>
  );
}
