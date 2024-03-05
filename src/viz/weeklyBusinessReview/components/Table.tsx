import { TableData } from '../types';

export const Table = ({
  data,
  numberFormatter,
}: {
  data: TableData;
  numberFormatter: (number: number) => string;
}) => {
  const percentFormatter = (number: number) =>
    `${number > 0 ? '+' : ''}${new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(number)}`;
  return (
    <table
      width="100%"
      style={{ border: '0.5px solid gray', borderCollapse: 'collapse' }}
    >
      <thead>
        <tr>
          <th style={{ textAlign: 'center' }}>LastWk</th>
          <th style={{ textAlign: 'center' }}>WOW</th>
          <th style={{ textAlign: 'center', borderRight: '0.5px solid gray' }}>
            YOY
          </th>
          <th style={{ textAlign: 'center' }}>MTD</th>
          <th style={{ textAlign: 'center', borderRight: '0.5px solid gray' }}>
            YOY
          </th>
          <th style={{ textAlign: 'center' }}>QTD</th>
          <th style={{ textAlign: 'center', borderRight: '0.5px solid gray' }}>
            YOY
          </th>
          <th style={{ textAlign: 'center' }}>YTD</th>
          <th style={{ textAlign: 'center' }}>YOY</th>
        </tr>
        <tr>
          <td style={{ textAlign: 'center' }}>
            {numberFormatter(data.week.lastWeek)}
          </td>
          <td style={{ textAlign: 'center' }}>
            {percentFormatter(data.week.weekOnWeek)}
          </td>
          <td style={{ textAlign: 'center', borderRight: '0.5px solid gray' }}>
            {percentFormatter(data.week.yearOnYear)}
          </td>
          <td style={{ textAlign: 'center' }}>
            {numberFormatter(data.month.monthToDate)}
          </td>
          <td style={{ textAlign: 'center', borderRight: '0.5px solid gray' }}>
            {percentFormatter(data.month.yearOnYear)}
          </td>
          <td style={{ textAlign: 'center' }}>
            {numberFormatter(data.quarter.quarterToDate)}
          </td>
          <td style={{ textAlign: 'center', borderRight: '0.5px solid gray' }}>
            {percentFormatter(data.quarter.yearOnYear)}
          </td>
          <td style={{ textAlign: 'center' }}>
            {numberFormatter(data.year.yearToDate)}
          </td>
          <td style={{ textAlign: 'center' }}>
            {percentFormatter(data.year.yearOnYear)}
          </td>
        </tr>
      </thead>
    </table>
  );
};
