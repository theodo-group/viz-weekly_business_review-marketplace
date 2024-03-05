import dayjs from "dayjs";

import { Link, OpenDrillFn, TransformConfigToOptions } from "../../types";

export enum SeriesType {
  PREVIOUS_YEAR = "previousYear",
  CURRENT_YEAR = "currentYear",
  TARGETS = "target",
}

export enum ChartType {
  WEEKS = "weeks",
  MONTHS = "months",
}

export type WeeklyBusinessReviewDataPoint = { value: number; link?: Link };

export type WeeklyBusinessReviewDataSeries = {
  [key in ChartType]: WeeklyBusinessReviewDataPoint[];
};

export type WeeklyBusinessReviewData = {
  [SeriesType.PREVIOUS_YEAR]: WeeklyBusinessReviewDataSeries;
  [SeriesType.CURRENT_YEAR]: WeeklyBusinessReviewDataSeries;
  [SeriesType.TARGETS]?: WeeklyBusinessReviewDataSeries;
} & {
  axis: {
    [key in ChartType]: string[];
  };
  openDrillFn: OpenDrillFn;
} & GraphConfig;

export type TableData = {
  week: {
    lastWeek: number;
    weekOnWeek: number;
    yearOnYear: number;
  };
  month: {
    monthToDate: number;
    yearOnYear: number;
  };
  quarter: {
    quarterToDate: number;
    yearOnYear: number;
  };
  year: {
    yearToDate: number;
    yearOnYear: number;
  };
};

export enum MetricType {
  INPUT = "Input",
  OUTPUT = "Output",
}

export enum NumberFormat {
  MILLION = "million",
  THOUSAND = "thousand",
  NONE = "none",
}

export enum NumberOutput {
  CURRENCY = "currency",
  NUMBER = "number",
  PERCENT = "percent",
}

export enum VisType {
  SUM = "sum",
  RATIO = "ratio",
  DIVIDE = "divide",
}

export enum AccumulationFunction {
  LAST_VALUE = "lastValue",
  SUM = "sum",
}

export type GraphConfig = {
  metricName: string;
};

export type OtherDisplayConfig = {
  shouldDisplayTable: boolean;
  metricOwner: string;
  metricType: MetricType;
  numberFormat: NumberFormat;
  numberOutput: NumberOutput;
  displayedDigits?: number;
};

export type WeeklyBusinessReviewVisConfig = GraphConfig & {
  visType: VisType;
  weeklyStandard: number;
  accumulationFunction: AccumulationFunction;
} & OtherDisplayConfig;

export type WeeklyBusinessReviewVisOptions =
  TransformConfigToOptions<WeeklyBusinessReviewVisConfig>;

export type WeeklyBusinessReviewRawData = {
  data: SumDatum[] | RatioDatum[];
  linkGenerator?: (startDate: string, endDate: string) => Link;
  accumulationFunction: AccumulationFunction;
  valueWhenNoData: number;
};

export type RatioDatum = {
  date: dayjs.Dayjs;
  numerator: number;
  denominator: number;
};

export type SumDatum = {
  date: dayjs.Dayjs;
  value: number;
};

export const isRatioData = (
  data: SumDatum[] | RatioDatum[] | (SumDatum | RatioDatum)[]
): data is RatioDatum[] => {
  return (data as RatioDatum[]).every((datum) => datum.numerator !== undefined);
};

export const isSumData = (
  data: SumDatum[] | RatioDatum[] | (SumDatum | RatioDatum)[]
): data is SumDatum[] => {
  return (data as SumDatum[]).every((datum) => datum.value !== undefined);
};

export type LinkGenerator = (startDate: string, endDate: string) => Link;
