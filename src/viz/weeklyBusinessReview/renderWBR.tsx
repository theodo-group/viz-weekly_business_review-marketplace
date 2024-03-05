import Highcharts from "highcharts";
import highchartsAccessibility from "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import ReactDOM from "react-dom/client";

import { MetricTypeTag } from "./components/MetricTypeTag";
import { Table } from "./components/Table";
import {
  OtherDisplayConfig,
  TableData,
  WeeklyBusinessReviewData,
} from "./types";
import { numberFormatterGenerator } from "./utils/numberFormatter";
import { baseOptionsGenerator } from "./utils/seriesConfigurationGenerator";
import { getSpacing } from "../../stylesheet";

highchartsAccessibility(Highcharts);

export const renderWBR = (
  element: HTMLElement,
  data: WeeklyBusinessReviewData,
  {
    shouldDisplayTable,
    metricType,
    metricOwner,
    numberFormat,
    numberOutput,
    displayedDigits,
  }: OtherDisplayConfig,
  tableData: TableData
) => {
  const numberFormatter = numberFormatterGenerator(
    numberFormat,
    numberOutput,
    displayedDigits
  );
  ReactDOM.createRoot(element).render(
    <React.StrictMode>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: "0.8em",
          marginBottom: getSpacing(1),
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: getSpacing(1),
          }}
        >
          <MetricTypeTag metricType={metricType} />
        </div>
        <div>{metricOwner}</div>
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        options={baseOptionsGenerator(data, numberFormatter)}
      />
      {shouldDisplayTable && (
        <Table data={tableData} numberFormatter={numberFormatter} />
      )}
    </React.StrictMode>
  );
};
