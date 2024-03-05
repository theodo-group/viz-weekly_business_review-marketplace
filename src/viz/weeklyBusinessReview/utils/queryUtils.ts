import dayjs, { Dayjs } from 'dayjs';

import {
  extractLastValueFromData,
  extractSumFromData,
} from './accumulatorUtils';
import { Link, VisData } from '../../../types';
import {
  AccumulationFunction,
  LinkGenerator,
  RatioDatum,
  SumDatum,
  TableData,
  WeeklyBusinessReviewData,
  WeeklyBusinessReviewRawData,
} from '../types';

export const getRawDataFromQueryData = (
  queryData: VisData,
  dateFieldName: string,
  numeratorFieldName: string,
  denominatorFieldName?: string,
): WeeklyBusinessReviewRawData['data'] => {
  const valueExtractor = (row: VisData[0], fieldName: string) =>
    row[fieldName].value === null ? 0 : (row[fieldName].value as number);

  if (denominatorFieldName !== undefined) {
    return queryData.map((row) => ({
      date: dayjs(row[dateFieldName].value as string),
      denominator: valueExtractor(row, denominatorFieldName),
      numerator: valueExtractor(row, numeratorFieldName),
    }));
  }

  return queryData.map((row) => ({
    date: dayjs(row[dateFieldName].value as string),
    value: valueExtractor(row, numeratorFieldName),
  }));
};

export const convertRawDataToVizData = ({
  data: rawData,
  linkGenerator,
  accumulationFunction,
  valueWhenNoData,
}: WeeklyBusinessReviewRawData): Omit<
  WeeklyBusinessReviewData,
  'metricName' | 'openDrillFn' | 'numberOutput' | 'numberFormat'
> => {
  const currentDate = dayjs();

  const weeksAxis = [];
  const previousYearWeekTotals = [];
  const currentYearWeekTotals = [];

  const NB_WEEKS_IN_PAST = 6;

  for (
    let weeksToSubtract = NB_WEEKS_IN_PAST;
    weeksToSubtract >= 1;
    weeksToSubtract--
  ) {
    const {
      currentYearWeekStart,
      currentYearWeekEnd,
      previousYearWeekStart,
      previousYearWeekEnd,
    } = getCurrentAndPreviousYearWeekStartAndEnd(currentDate, weeksToSubtract);

    weeksAxis.push(`Wk ${currentYearWeekStart.isoWeek()}`);

    currentYearWeekTotals.push(
      getDataFromBoundaries(
        currentYearWeekStart,
        currentYearWeekEnd,
        rawData,
        accumulationFunction,
        valueWhenNoData,
        linkGenerator,
      ),
    );

    previousYearWeekTotals.push(
      getDataFromBoundaries(
        previousYearWeekStart,
        previousYearWeekEnd,
        rawData,
        accumulationFunction,
        valueWhenNoData,
        linkGenerator,
      ),
    );
  }

  const monthsAxis = [];
  const previousYearMonthTotals = [];
  const currentYearMonthTotals = [];

  const NB_MONTHS_IN_PAST = 12;

  for (
    let monthsToSubtract = NB_MONTHS_IN_PAST;
    monthsToSubtract >= 1;
    monthsToSubtract--
  ) {
    const currentDateMinusMonths = currentDate.subtract(
      monthsToSubtract,
      'month',
    );

    monthsAxis.push(currentDateMinusMonths.format('MMM'));

    const month = currentDateMinusMonths.month();
    const year = currentDateMinusMonths.year();

    const currentYearMonthStart = dayjs().year(year).month(month).date(1);
    const currentYearMonthEnd = currentYearMonthStart.endOf('month');

    currentYearMonthTotals.push(
      getDataFromBoundaries(
        currentYearMonthStart,
        currentYearMonthEnd,
        rawData,
        accumulationFunction,
        valueWhenNoData,
        linkGenerator,
      ),
    );

    const previousYearMonthStart = dayjs()
      .year(year - 1)
      .month(month)
      .date(1);
    const previousYearMonthEnd = previousYearMonthStart.endOf('month');

    previousYearMonthTotals.push(
      getDataFromBoundaries(
        previousYearMonthStart,
        previousYearMonthEnd,
        rawData,
        accumulationFunction,
        valueWhenNoData,
        linkGenerator,
      ),
    );
  }

  return {
    axis: {
      weeks: weeksAxis,
      months: monthsAxis,
    },
    previousYear: {
      weeks: previousYearWeekTotals,
      months: previousYearMonthTotals,
    },
    currentYear: {
      weeks: currentYearWeekTotals,
      months: currentYearMonthTotals,
    },
  };
};

export const computeTableData = (
  data: WeeklyBusinessReviewRawData['data'],
  accumulationFunction: AccumulationFunction,
  comparisonType: 'difference' | 'ratio' = 'ratio',
  valueWhenNoData: number,
): TableData => {
  const currentDate = dayjs();
  const {
    previousYearWeekStart,
    previousYearWeekEnd,
    currentYearWeekStart,
    currentYearWeekEnd,
  } = getCurrentAndPreviousYearWeekStartAndEnd(currentDate, 1);

  const previousYearWeekTotal = getDataFromBoundaries(
    previousYearWeekStart,
    previousYearWeekEnd,
    data,
    accumulationFunction,
    valueWhenNoData,
  ).value;
  const currentYearWeekTotal = getDataFromBoundaries(
    currentYearWeekStart,
    currentYearWeekEnd,
    data,
    accumulationFunction,
    valueWhenNoData,
  ).value;
  const currentYearWeekBeforeTotal = getDataFromBoundaries(
    currentYearWeekStart.subtract(1, 'week'),
    currentYearWeekEnd.subtract(1, 'week'),
    data,
    accumulationFunction,
    valueWhenNoData,
  ).value;

  const currentYearMonthToDateTotal = getDataFromBoundaries(
    currentYearWeekEnd.startOf('month'),
    currentYearWeekEnd,
    data,
    accumulationFunction,
    valueWhenNoData,
  ).value;

  const previousYearMonthToDateTotal = getDataFromBoundaries(
    currentYearWeekEnd.subtract(1, 'year').startOf('month'),
    currentYearWeekEnd.subtract(1, 'year'),
    data,
    accumulationFunction,
    valueWhenNoData,
  ).value;

  const currentYearQuarterToDateTotal = getDataFromBoundaries(
    currentYearWeekEnd.startOf('quarter'),
    currentYearWeekEnd,
    data,
    accumulationFunction,
    valueWhenNoData,
  ).value;

  const previousYearQuarterToDateTotal = getDataFromBoundaries(
    currentYearWeekEnd.subtract(1, 'year').startOf('quarter'),
    currentYearWeekEnd.subtract(1, 'year'),
    data,
    accumulationFunction,
    valueWhenNoData,
  ).value;

  const currentYearYearToDateTotal = getDataFromBoundaries(
    currentYearWeekEnd.startOf('year'),
    currentYearWeekEnd,
    data,
    accumulationFunction,
    valueWhenNoData,
  ).value;

  const previousYearYearToDateTotal = getDataFromBoundaries(
    currentYearWeekEnd.subtract(1, 'year').startOf('year'),
    currentYearWeekEnd.subtract(1, 'year'),
    data,
    accumulationFunction,
    valueWhenNoData,
  ).value;

  return {
    week: {
      lastWeek: currentYearWeekTotal,
      weekOnWeek: getComparison(
        currentYearWeekTotal,
        currentYearWeekBeforeTotal,
        comparisonType,
      ),
      yearOnYear: getComparison(
        currentYearWeekTotal,
        previousYearWeekTotal,
        comparisonType,
      ),
    },
    month: {
      monthToDate: currentYearMonthToDateTotal,
      yearOnYear: getComparison(
        currentYearMonthToDateTotal,
        previousYearMonthToDateTotal,
        comparisonType,
      ),
    },
    quarter: {
      quarterToDate: currentYearQuarterToDateTotal,
      yearOnYear: getComparison(
        currentYearQuarterToDateTotal,
        previousYearQuarterToDateTotal,
        comparisonType,
      ),
    },
    year: {
      yearToDate: currentYearYearToDateTotal,
      yearOnYear: getComparison(
        currentYearYearToDateTotal,
        previousYearYearToDateTotal,
        comparisonType,
      ),
    },
  };
};

const getComparison = (
  currentValue: number,
  previousValue: number,
  comparisonType: 'difference' | 'ratio',
) =>
  comparisonType === 'ratio'
    ? currentValue / previousValue - 1
    : currentValue - previousValue;

export const getLinkGenerator = (
  linksOfFirstMeasureField: Link[] | undefined,
  dateFieldName: string,
  datesToConsiderForDrill: 'endOnly' | 'all',
): LinkGenerator | undefined => {
  if (
    linksOfFirstMeasureField == undefined ||
    linksOfFirstMeasureField.length == 0
  ) {
    return undefined;
  }

  const firstLink = linksOfFirstMeasureField[0];
  const dummyURL = 'https://dummy.com';
  const firstLinkURL = new URL(`${dummyURL}${firstLink.url}`);
  firstLinkURL.searchParams.delete(`f[${dateFieldName}]`);
  return (startDate, endDate): Link => {
    const url = new URL(firstLinkURL);
    let filter: string;
    let drillLabel: string;
    if (datesToConsiderForDrill === 'endOnly') {
      filter = endDate;
      drillLabel = `Drill on ${endDate}`;
    } else {
      filter = `${startDate} to ${dayjs(endDate, 'YYYY-MM-DD')
        .add(1, 'day')
        .format('YYYY-MM-DD')}`;
      drillLabel = `Drill from ${startDate} to ${endDate}`;
    }
    url.searchParams.set(`f[${dateFieldName}]`, filter);
    return {
      label: 'Show all',
      type: 'drill',
      type_label: drillLabel,
      url: url.toString().replace(dummyURL, ''),
    };
  };
};

const getDataFromBoundaries = (
  startDate: Dayjs,
  endDate: Dayjs,
  data: SumDatum[] | RatioDatum[],
  accumulationFunction: AccumulationFunction,
  valueWhenNoData: number = 0,
  linkGenerator?: LinkGenerator,
) => {
  let value: number = 0;

  const filteredData = data.filter((row) =>
    row.date.isBetween(startDate, endDate, 'day', '[]'),
  );

  if (accumulationFunction === AccumulationFunction.SUM) {
    value = extractSumFromData(filteredData, valueWhenNoData);
  }

  if (accumulationFunction === AccumulationFunction.LAST_VALUE) {
    value = extractLastValueFromData(filteredData);
  }

  return {
    value,
    ...(linkGenerator !== undefined
      ? {
          link: linkGenerator(
            startDate.format('YYYY-MM-DD'),
            endDate.format('YYYY-MM-DD'),
          ),
        }
      : {}),
  };
};

const getCurrentAndPreviousYearWeekStartAndEnd = (
  currentDate: Dayjs,
  weeksToSubtract: number,
) => {
  const currentDateMinusWeeks = currentDate.subtract(weeksToSubtract, 'week');
  const currentYearWeekStart = currentDateMinusWeeks.startOf('isoWeek');
  const currentYearWeekEnd = currentDateMinusWeeks.endOf('isoWeek');
  const previousYearWeekStart = currentYearWeekStart
    .add(2, 'days')
    .subtract(1, 'year')
    .startOf('isoWeek');
  const previousYearWeekEnd = previousYearWeekStart.endOf('isoWeek');

  return {
    currentYearWeekStart,
    currentYearWeekEnd,
    previousYearWeekStart,
    previousYearWeekEnd,
  };
};
