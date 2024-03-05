import { SymbolKeyValue } from 'highcharts';

import {
  ChartType,
  SeriesType,
  WeeklyBusinessReviewData,
  WeeklyBusinessReviewDataSeries,
} from './../types';
import { colorPalette } from '../../../stylesheet';
import { OpenDrillFn } from '../../../types';

type AvailableSeriesType =
  | Highcharts.SeriesSplineOptions
  | Highcharts.SeriesLineOptions
  | Highcharts.SeriesScatterOptions;

export const baseOptionsGenerator = (
  {
    axis,
    previousYear,
    currentYear,
    target,
    metricName,
    openDrillFn,
  }: WeeklyBusinessReviewData,
  numberFormatter: (number: number) => string,
): Omit<Highcharts.Options, 'series'> & {
  series: AvailableSeriesType[];
} => {
  return {
    chart: {
      numberFormatter,
    },
    title: {
      text: undefined,
    },
    plotOptions: {
      series: {
        animation: false,
      },
    },
    xAxis: {
      crosshair: true,
      categories: [...axis.weeks, '', ...axis.months],
    },
    yAxis: [
      {
        title: {
          text: null,
          style: {
            color: colorPalette.lightBlue,
          },
        },
        max: null,
        labels: {
          style: {
            color: colorPalette.lightBlue,
          },
          formatter() {
            if (typeof this.value === 'number') {
              return numberFormatter(this.value);
            }
            return this.value;
          },
        },
      },
      {
        title: {
          text: null,
          style: {
            color: colorPalette.red,
          },
        },
        max: null,
        labels: {
          style: {
            color: colorPalette.red,
          },
          formatter() {
            if (typeof this.value === 'number') {
              return numberFormatter(this.value);
            }
            return this.value;
          },
        },
        opposite: true,
      },
    ],
    series: [
      ...(target !== undefined
        ? generateSeries(
            target,
            targetSeriesConfiguration,
            SeriesType.TARGETS,
            openDrillFn,
          )
        : []),
      ...generateSeries(
        previousYear,
        previousYearSeriesConfigurationGenerator(metricName),
        SeriesType.PREVIOUS_YEAR,
        openDrillFn,
      ),
      ...generateSeries(
        currentYear,
        currentYearSeriesConfigurationGenerator(metricName),
        SeriesType.CURRENT_YEAR,
        openDrillFn,
      ),
    ],
    credits: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
  };
};

const generateSeries = (
  { weeks, months }: WeeklyBusinessReviewDataSeries,
  serieConfiguration: Omit<AvailableSeriesType, 'data'>,
  serieType: SeriesType,
  openDrillFn: OpenDrillFn,
): AvailableSeriesType[] => [
  {
    ...serieConfiguration,
    id: `${serieType}-${ChartType.WEEKS}`,
    data: [
      ...weeks.map(({ value }) => value),
      ...Array(months.length + 1).fill(''),
    ],
    yAxis: 0,
    point: {
      events: {
        click(event) {
          const link = weeks[this.index]?.link;
          if (link !== undefined) {
            openDrillFn(link, event);
          }
        },
      },
    },
  },
  {
    ...serieConfiguration,
    id: `${serieType}-${ChartType.MONTHS}`,
    data: [
      ...Array(weeks.length + 1).fill(''),
      ...months.map(({ value }) => value),
    ],
    showInLegend: false,
    yAxis: 1,
    point: {
      events: {
        click(event) {
          const link = months[this.index - weeks.length - 1]?.link;
          if (link !== undefined) {
            openDrillFn(link, event);
          }
        },
      },
    },
  },
];

const previousYearSeriesConfigurationGenerator = (legend: string) =>
  seriesConfigurationGenerator(
    `${legend} - PY`,
    'line',
    colorPalette.lightRed,
    'diamond',
    false,
    false,
  );

const currentYearSeriesConfigurationGenerator = (legend: string) =>
  seriesConfigurationGenerator(
    `${legend} - CY`,
    'spline',
    colorPalette.blue,
    'circle',
    true,
    true,
  );

const targetSeriesConfiguration: Omit<Highcharts.SeriesScatterOptions, 'data'> =
  {
    type: 'scatter',
    marker: {
      symbol: 'triangle',
    },
    color: colorPalette.green,
    showInLegend: false,
  };

const seriesConfigurationGenerator = (
  name: string,
  type: 'line' | 'spline',
  color: string,
  markerSymbol: SymbolKeyValue,
  markerEnabled: boolean,
  dataLabelsEnabled: boolean,
): Omit<
  Highcharts.SeriesSplineOptions | Highcharts.SeriesLineOptions,
  'data'
> => ({
  type,
  cursor: 'pointer',
  marker: { symbol: markerSymbol, enabled: markerEnabled },
  dataLabels: {
    enabled: dataLabelsEnabled,
  },
  color,
  name,
});
