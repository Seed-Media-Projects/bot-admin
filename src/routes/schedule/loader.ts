import { getSchedulesFX } from '@core/schedule';

export const schedulesLoader = async () => {
  const schedules = await getSchedulesFX();

  return { schedules };
};
