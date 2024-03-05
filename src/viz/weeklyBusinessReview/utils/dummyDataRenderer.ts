import { getMockGraphData, mockTableData } from "./mockGraphData";
import { renderWBR } from "../renderWBR";
import { MetricType, NumberFormat, NumberOutput } from "../types";

export const renderDummyData = (
  element: HTMLElement,
  numberFormat: NumberFormat,
  displayedDigits: number | undefined,
  numberOutput: NumberOutput,
  weekMax: number,
  monthMax: number
) => {
  renderWBR(
    element,
    getMockGraphData("Metric to analyze", weekMax, monthMax),
    {
      shouldDisplayTable: true,
      metricType: MetricType.INPUT,
      metricOwner: "John Doe",
      numberFormat,
      displayedDigits,
      numberOutput,
    },
    mockTableData
  );
};
