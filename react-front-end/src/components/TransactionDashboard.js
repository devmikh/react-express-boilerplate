import React from "react";
import {
  VictoryPie,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryLabel,
  VictoryAxis,
  VictoryBar,
} from "victory";
import Card from "./Card";

export default function TransactionDashboard(props) {
  const { transactions } = props;

  // // Pie logic
  // let categories = warranties.map((warranty) => {
  //   return warranty.item_category;
  // });
  // let filteredCategories = categories.filter(
  //   (category, index) => categories.indexOf(category) === index
  // );
  // let dataObj = {};
  // filteredCategories.forEach((category) => (dataObj[category] = 0));

  // warranties.forEach((warranty) => {
  //   dataObj[warranty.item_category]++;
  // });
  // let data = [];
  // for (let category in dataObj) {
  //   data.push({ x: category, y: dataObj[category] });
  // }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  function calculateTotalForMonth(month, year) {
    let total = 0;
    transactions.forEach((transaction) => {
      let transactionDate = new Date(parseInt(transaction.date, 10));
      //console.log(transactionDate.getMonth());

      if (
        transactionDate.getMonth() === month &&
        transactionDate.getFullYear() === year
      ) {
        total += transaction.amount;
      }
    });
    //console.log(total);
    return total;
  }
  function calculateTotalForYear(year) {
    let total = 0;
    transactions.forEach((transaction) => {
      let transactionDate = new Date(parseInt(transaction.date, 10));

      if (transactionDate.getFullYear() === year) {
        total += transaction.amount;
      }
    });
    return total;
  }
  function fetchThisYearDataForGraph() {
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let data = [];
    for (let month = 0; month <= 11; month++) {
      data.push({
        x: months[month],
        y: calculateTotalForMonth(month, new Date().getFullYear()),
      });
    }
    return data;
  }
  function fetchAllYearsDataForGraph() {
    const years = [];
    transactions.forEach((transaction) => {
      let transactionYear = new Date(
        parseInt(transaction.date, 10)
      ).getFullYear();
      if (!years.includes(transactionYear)) {
        years.push(transactionYear);
      }
    });
    years.sort((a, b) => a - b);
    // let data = [];
    const data = years.map((year) => {
      return {
        x: year.toString(),
        y: calculateTotalForYear(year),
      };
    });
    // for (let month = 2015; month <= 11; month++) {
    //   data.push({
    //     x: months[month],
    //     y: calculateTotalForMonth(month, new Date().getFullYear()),
    //   });
    // }
    //data.push({ x: "2021", y: 0 });
    return data;
  }
  //console.log(fetchAllYearsDataForGraph());

  return (
    <div className="dashboard-transactions">
      <div className="dashboard-transactions-first">
        <h2>Monthly Spend</h2>
        <VictoryChart
          theme={VictoryTheme.material}
          height={400}
          width={600}
          domainPadding={30}
        >
          {/* <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
            }}
            data={fetchThisYearDataForGraph()}

          /> */}
          <VictoryBar
            data={fetchThisYearDataForGraph()}
            style={{
              data: { fill: "#c43a31" },
            }}
          />
          {/* <VictoryAxis />
          <VictoryAxis dependentAxis /> */}
        </VictoryChart>
        <Card
          title="Total Spent This Month"
          total={formatter.format(
            calculateTotalForMonth(
              new Date().getMonth(),
              new Date().getFullYear()
            )
          )}
          icon={"fa fa-usd fa-5x"}
          caution
        />
      </div>
      <div className="dashboard-transactions-second">
        <h2>Yearly Spend</h2>
        <VictoryChart
          theme={VictoryTheme.material}
          height={400}
          width={600}
          domainPadding={30}
        >
          {/* <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
            }}
            data={fetchAllYearsDataForGraph()}
          /> */}
          <VictoryBar
            style={{ data: { fill: "#c43a31" } }}
            data={fetchAllYearsDataForGraph()}
          />
        </VictoryChart>
        <Card
          title="Total Spent This Year"
          total={formatter.format(
            calculateTotalForYear(new Date().getFullYear())
          )}
          icon={"fa fa-usd fa-5x"}
          caution
        />
      </div>
    </div>
  );
}
