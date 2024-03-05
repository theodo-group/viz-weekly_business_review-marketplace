import { colorPalette, getSpacing } from '../../../stylesheet';
import { MetricType } from '../types';

export const MetricTypeTag = ({ metricType }: { metricType: MetricType }) => (
  <div
    style={{
      color: 'white',
      backgroundColor:
        metricType === MetricType.INPUT
          ? colorPalette.lightGreen
          : colorPalette.lightBlue,
      padding: `${getSpacing(0.5)}px ${getSpacing(1)}px`,
      textAlign: 'center',
      borderRadius: '5px',
      width: 'fit-content',
    }}
  >
    {metricType.toUpperCase()}
  </div>
);
