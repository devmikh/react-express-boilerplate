import React, { useEffect } from "react";
import { VictoryPie } from "victory";
import Card from "./Card";

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

  // let fake = { start_date: "1586652092000", id: 1 };
  // let fakeT = [
  //   { date: "1586652091000", amount: 40, entry_id: 1 },
  //   { date: "1586911292000", amount: 40, entry_id: 1 },
  //   { date: "1591317692000", amount: 40, entry_id: 1 },
  //   { date: "1593477692000", amount: 40, entry_id: 2 },
  // ];
  useEffect(() => {
    // console.log(transactions);
    // console.log(payments);
    // console.log(currentMonthUnPaid(payments[1], transactions));
    console.log(calculateTotalUnpaidForThisMonth());
  }, [payments, transactions]);

  // let greenWarranties = warranties.filter((warranty) => {
  //   return (
  //     monthDiffFromNow(warranty.start_date) / warranty.duration_in_months <=
  //     0.25
  //   );
  // }).length;

  // let yellowWarranties = warranties.filter((warranty) => {
  //   return (
  //     monthDiffFromNow(warranty.start_date) / warranty.duration_in_months <=
  //       0.75 &&
  //     monthDiffFromNow(warranty.start_date) / warranty.duration_in_months > 0.25
  //   );
  // }).length;

  // let redWarranties = warranties.filter((warranty) => {
  //   return (
  //     monthDiffFromNow(warranty.start_date) / warranty.duration_in_months >=
  //     0.75
  //   );
  // }).length;

  return (
    <div style={{ width: "60%" }}>
      <VictoryPie data={data} height={200} style={{ width: "50%" }} />
      <Card
        title="Total Payments"
        total={payments.length}
        icon={"fa fa-file-text fa-5x"}
      />

      <Card
        title="Total Unpaid This Month"
        total={calculateTotalUnpaidForThisMonth()}
        icon={"fa fa-file-text fa-5x"}
      />
      {/* <Card
        title="Total Safe"
        total={greenWarranties}
        icon={"fa fa-file-text fa-5x"}
      />
      <Card
        title="Total Caution"
        total={yellowWarranties}
        icon={"fa fa-file-text fa-5x"}
      />
      <Card
        title="Total Danger"
        total={redWarranties}
        icon={"fa fa-file-text fa-5x"}
      /> */}
    </div>
  );
}
