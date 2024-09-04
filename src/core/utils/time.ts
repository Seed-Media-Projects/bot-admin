import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const computeDuration = (startingTime: dayjs.ConfigType) => {
  const fromTime = dayjs().add(dayjs.duration(dayjs(startingTime).diff(dayjs())));
  const diff = dayjs().diff(fromTime);
  return dayjs.duration(diff);
};
