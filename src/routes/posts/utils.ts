import { IntervalObj, IntervalTypes } from '@core/posts';

export const getValuesFromInterval = ({ hours, minutes, seconds }: IntervalObj) => {
  if (seconds) {
    return {
      value: seconds,
      type: IntervalTypes.Seconds,
    };
  }
  if (minutes) {
    return {
      value: minutes,
      type: IntervalTypes.Minutes,
    };
  }
  if (hours) {
    return {
      value: hours,
      type: IntervalTypes.Hours,
    };
  }

  return {
    value: undefined,
    type: IntervalTypes.Seconds,
  };
};
