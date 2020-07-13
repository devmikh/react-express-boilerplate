import React from "react";
import { VictoryPie, VictoryTheme } from "victory";
import Card from "./Card";
import "./WarrantyDashboard.scss";

export default function WarrantyDashboard(props) {
  const { warranties } = props;
  // Pie logic
  let categories = warranties.map((warranty) => {
    return warranty.item_category;
  });
  let filteredCategories = categories.filter(
    (category, index) => categories.indexOf(category) === index
  );
  let dataObj = {};
  filteredCategories.forEach((category) => (dataObj[category] = 0));

  warranties.forEach((warranty) => {
    dataObj[warranty.item_category]++;
  });
  let data = [];
  for (let category in dataObj) {
    data.push({ x: category, y: dataObj[category] });
  }
  // Card logic
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

  let greenWarranties = warranties.filter((warranty) => {
    return (
      monthDiffFromNow(warranty.start_date) / warranty.duration_in_months <=
      0.25
    );
  }).length;

  let yellowWarranties = warranties.filter((warranty) => {
    return (
      monthDiffFromNow(warranty.start_date) / warranty.duration_in_months <=
        0.75 &&
      monthDiffFromNow(warranty.start_date) / warranty.duration_in_months > 0.25
    );
  }).length;

  let redWarranties = warranties.filter((warranty) => {
    return (
      monthDiffFromNow(warranty.start_date) / warranty.duration_in_months >=
      0.75
    );
  }).length;

  return (
    <div className="warranty-dashboard">
      <div className="warranty-dashboard-chart-container">
        <VictoryPie
          data={data}
          height={240}
          style={{ width: "50%" }}
          theme={VictoryTheme.material}
        />
      </div>
      <div className="column-1">
        <Card
          title="Total Warranties"
          total={warranties.length}
          icon={"fa fa-file-text fa-5x"}
        />
        <Card
          title="Total Safe"
          total={greenWarranties}
          icon={"fa fa-check fa-5x"}
          safe
        />
      </div>
      <div className="column-2">
        <Card
          title="Total Caution"
          total={yellowWarranties}
          icon={"fa fa-exclamation-triangle fa-5x"}
          caution
        />
        <Card
          title="Total Danger"
          total={redWarranties}
          icon={"fa fa-exclamation-triangle fa-5x"}
          danger
        />
      </div>
    </div>
  );
}
