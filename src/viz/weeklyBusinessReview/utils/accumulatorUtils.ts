import { RatioDatum, SumDatum, isRatioData, isSumData } from '../types';

const SUM_ACCUMULATION_FUNCTION = (a: number, b: number) => a + b;

export const extractSumFromData = (
  data: (SumDatum | RatioDatum)[],
  valueWhenNoData: number,
) => {
  let value: number = 0;
  if (isRatioData(data)) {
    const numerator = data
      .map((row) => row.numerator)
      .reduce(SUM_ACCUMULATION_FUNCTION, 0);
    const denominator = data
      .map((row) => row.denominator)
      .reduce(SUM_ACCUMULATION_FUNCTION, 0);

    value = denominator === 0 ? valueWhenNoData : numerator / denominator;
  }

  if (isSumData(data)) {
    value = data.map((row) => row.value).reduce(SUM_ACCUMULATION_FUNCTION, 0);
  }

  return value;
};

const REVERSE_DATE_SORTING = (
  a: SumDatum | RatioDatum,
  b: SumDatum | RatioDatum,
) => b.date.diff(a.date, 'day');

export const extractLastValueFromData = (data: (SumDatum | RatioDatum)[]) => {
  let value: number = 0;
  if (isRatioData(data)) {
    const sortedData = data
      .filter((datum) => datum.denominator !== 0 && datum.numerator !== 0)
      .sort(REVERSE_DATE_SORTING);

    if (sortedData.length === 0) {
      return 0;
    }
    value =
      sortedData[0].denominator === 0
        ? 0
        : sortedData[0].numerator / sortedData[0].denominator;
  }

  if (isSumData(data)) {
    const sortedData = data
      .filter((datum) => datum.value !== 0)
      .sort(REVERSE_DATE_SORTING);

    if (sortedData.length === 0) {
      return 0;
    }
    value = sortedData[0].value;
  }

  return value;
};
