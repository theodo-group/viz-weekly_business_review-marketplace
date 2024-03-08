import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isoWeek from "dayjs/plugin/isoWeek";
import QuarterOfYear from "dayjs/plugin/quarterOfYear";
import weekOfYear from "dayjs/plugin/weekOfYear";

import { renderWBR } from "./renderWBR";
import {
  AccumulationFunction,
  MetricType,
  NumberFormat,
  VisType,
  WeeklyBusinessReviewVisConfig,
} from "./types";
import { weeklyBusinessReviewVisOptions } from "./utils/constants";
import {
  computeTableData,
  convertRawDataToVizData,
  getLinkGenerator,
  getRawDataFromQueryData,
} from "./utils/queryUtils";
import {
  VisualizationDefinition,
  Looker,
  Cell,
  LookerChartUtils,
  OpenDrillFn,
} from "../../types";
import { isValidQueryResponse } from "./utils/queryResponseValidator";
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(isBetween);
dayjs.extend(QuarterOfYear);

declare const looker: Looker<WeeklyBusinessReviewVisConfig>;
declare const LookerCharts: LookerChartUtils;

const openDrillMenu: OpenDrillFn = (link, event) => {
  LookerCharts.Utils.openDrillMenu({
    links: [link],
    event,
  });
};

const vis: VisualizationDefinition<WeeklyBusinessReviewVisConfig> = {
  options: weeklyBusinessReviewVisOptions,
  create: () => {},
  updateAsync(data, element, config, queryResponse, _details, done) {
    const {
      metricName,
      numberFormat,
      displayedDigits,
      numberOutput,
      shouldDisplayTable,
      metricType = MetricType.INPUT,
      visType = VisType.SUM,
      accumulationFunction = AccumulationFunction.SUM,
      metricOwner,
      weeklyStandard,
    } = config;

    const queryResponseValidation = isValidQueryResponse(
      queryResponse,
      visType
    );

    if (queryResponseValidation.isValid === true) {
      this.clearErrors && this.clearErrors();
    }

    if (queryResponseValidation.isValid === false) {
      this.addError &&
        this.addError({
          title: queryResponseValidation.errorTitle,
          message: queryResponseValidation.errorMessage,
        });
      return;
    }

    const dateFieldName = queryResponse.fields.dimensions[0].name;
    const numeratorFieldName = queryResponse.fields.measures[0].name;
    const denominatorFieldName = queryResponse.fields.measures[1]?.name;

    const vizRawData = getRawDataFromQueryData(
      data,
      dateFieldName,
      numeratorFieldName,
      denominatorFieldName
    );

    const fieldToConsiderForLink =
      visType === VisType.SUM ? numeratorFieldName : denominatorFieldName;

    const firstNonEmptyRow = data.filter(
      (datum) => datum[fieldToConsiderForLink].value !== null
    )[0];

    const linkGenerator =
      firstNonEmptyRow !== undefined
        ? getLinkGenerator(
            (firstNonEmptyRow[fieldToConsiderForLink] as Cell).links,
            dateFieldName,
            accumulationFunction === AccumulationFunction.LAST_VALUE
              ? "endOnly"
              : "all"
          )
        : undefined;

    const vizData = convertRawDataToVizData({
      data: vizRawData,
      linkGenerator,
      accumulationFunction,
      valueWhenNoData: visType === VisType.RATIO ? 1 : 0,
    });

    if (weeklyStandard > 0) {
      const AVERAGE_NUMBER_OF_WEEKS_IN_A_MONTH = 4.35;

      vizData.target = {
        weeks: Array(vizData.currentYear.weeks.length).fill({
          value: weeklyStandard,
        }),
        months: Array(vizData.currentYear.months.length).fill({
          value:
            weeklyStandard *
            (visType === VisType.SUM ? AVERAGE_NUMBER_OF_WEEKS_IN_A_MONTH : 1),
        }),
      };
    }

    const tableData = computeTableData(
      vizRawData,
      accumulationFunction,
      visType === VisType.SUM ? "ratio" : "difference",
      visType === VisType.RATIO ? 1 : 0
    );

    renderWBR(
      element,
      {
        ...vizData,
        metricName,
        openDrillFn: openDrillMenu,
      },
      {
        shouldDisplayTable,
        metricType,
        metricOwner,
        numberFormat:
          numberFormat === null || numberFormat === undefined
            ? NumberFormat.NONE
            : numberFormat,
        displayedDigits: displayedDigits === null ? undefined : displayedDigits,
        numberOutput,
      },
      tableData
    );

    done();
  },
};

looker.plugins.visualizations.add(vis);
