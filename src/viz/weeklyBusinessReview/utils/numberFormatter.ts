import numbro from 'numbro';

import { NumberFormat, NumberOutput } from '../types';

export const numberFormatterGenerator =
  (
    numberFormat: NumberFormat,
    numberOutput: NumberOutput | undefined,
    displayedDigits: number | undefined,
  ) =>
  (number: number) =>
    numbro(number)
      .format({
        ...(numberOutput !== undefined && { output: numberOutput }),
        ...(numberFormat !== NumberFormat.NONE && {
          forceAverage: numberFormat,
        }),
        ...(displayedDigits !== undefined && { mantissa: displayedDigits }),
        currencySymbol: '€',
        currencyPosition: 'postfix',
      })
      .toUpperCase();
