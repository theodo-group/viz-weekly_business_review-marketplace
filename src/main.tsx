import { NumberFormat, NumberOutput } from './viz/weeklyBusinessReview/types';
import { renderDummyData } from './viz/weeklyBusinessReview/utils/dummyDataRenderer';

renderDummyData(
  document.getElementById('sum_root')!,
  NumberFormat.MILLION,
  2,
  NumberOutput.CURRENCY,
  1000000,
  10000000,
);

renderDummyData(
  document.getElementById('ratio_root')!,
  NumberFormat.NONE,
  2,
  NumberOutput.PERCENT,
  1,
  1,
);
