import { TableData, WeeklyBusinessReviewData } from '../types';

const axis = {
  weeks: ['Week 43', 'Week 44', 'Week 45', 'Week 46', 'Week 47', 'Week 48'],
  months: [
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
  ],
};

const getRandomData = (length: number, max: number) =>
  Array(length)
    .fill(null)
    .map((_) => ({
      value: Math.random() * max,
    }));

const getRandomWeekData = (max: number) => getRandomData(6, max);

const getRandomMonthData = (max: number) => getRandomData(12, max);

const getTargetData = (length: number, value: number) =>
  Array(length).fill({
    value,
  });

export const getMockGraphData = (
  metricName: string,
  weekMax: number,
  monthMax: number,
): WeeklyBusinessReviewData => ({
  axis,
  previousYear: {
    weeks: getRandomWeekData(weekMax),
    months: getRandomMonthData(monthMax),
  },
  currentYear: {
    weeks: getRandomWeekData(weekMax),
    months: getRandomMonthData(monthMax),
  },
  target: {
    weeks: getTargetData(6, weekMax * 0.75),
    months: getTargetData(12, monthMax * 0.75),
  },
  metricName,
  openDrillFn: () => alert('Drill is not enabled for dummy data'),
});

export const mockTableData: TableData = {
  week: {
    lastWeek: 10,
    weekOnWeek: -0.5,
    yearOnYear: 0.5,
  },
  month: {
    monthToDate: 35,
    yearOnYear: -0.5,
  },
  quarter: {
    quarterToDate: 75,
    yearOnYear: -0.3,
  },
  year: {
    yearToDate: 100,
    yearOnYear: -0.2,
  },
};
