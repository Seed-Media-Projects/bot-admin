import { getScheduleFX } from '@core/schedule';
import { LoaderFunctionArgs } from 'react-router-dom';

export const scheduleEditLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) {
    return { schedule: null };
  }
  const schedule = await getScheduleFX(Number(params.id));

  return { schedule };
};
