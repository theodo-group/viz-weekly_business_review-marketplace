import {
  AccumulationFunction,
  MetricType,
  NumberFormat,
  NumberOutput,
  VisType,
  WeeklyBusinessReviewVisOptions,
} from "../types";

export const weeklyBusinessReviewVisOptions: WeeklyBusinessReviewVisOptions = {
  metricName: {
    type: "string",
    label: "Metric Name",
    placeholder: "Metric Name displayed in the legend",
    required: true,
  },
  metricOwner: {
    type: "string",
    label: "Metric Owner",
    placeholder: "Name of the person responsible for the metric",
    required: true,
    default: "Choose your metric owner",
  },
  visType: {
    type: "string",
    label: "Vis Type",
    display: "select",
    default: VisType.SUM,
    required: true,
    values: Object.values(VisType).map((visType) => ({
      [visType]: visType,
    })),
  },
  metricType: {
    type: "string",
    label: "Metric Type",
    display: "select",
    default: MetricType.INPUT,
    required: true,
    values: Object.values(MetricType).map((metricType) => ({
      [metricType]: metricType,
    })),
  },
  weeklyStandard: {
    type: "number",
    label: "Weekly Standard",
    required: true,
    default: 0,
  },
  numberOutput: {
    type: "string",
    label: "Number Output",
    display: "select",
    default: NumberOutput.NUMBER,
    values: Object.values(NumberOutput).map((numberOutput) => ({
      [numberOutput]: numberOutput,
    })),
    required: true,
  },
  numberFormat: {
    type: "string",
    label: "Number Format",
    display: "select",
    default: NumberFormat.NONE,
    values: [
      ...Object.values(NumberFormat).map((numberFormat) => ({
        [numberFormat]: numberFormat,
      })),
    ],
    required: true,
    display_size: "half",
  },
  displayedDigits: {
    type: "number",
    label: "Displayed Digits",
    required: false,
    display_size: "half",
  },
  accumulationFunction: {
    type: "string",
    label: "Accumulation Function",
    display: "select",
    default: AccumulationFunction.SUM,
    values: [
      ...Object.values(AccumulationFunction).map((accumulationFunction) => ({
        [accumulationFunction]: accumulationFunction,
      })),
    ],
    required: true,
  },
  shouldDisplayTable: {
    type: "boolean",
    label: "Display Comparison Table",
    default: true,
    required: true,
  },
};
