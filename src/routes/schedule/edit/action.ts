import { saveScheduleFX, SaveSchedulePayload } from '@core/schedule';
import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { sortedTimes } from '../utils';

export const editScheduleAction = async ({ request, params }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const payload: SaveSchedulePayload = {
    name: data.name.toString(),
    times: sortedTimes(JSON.parse(data.times.toString()) as string[]),
  };

  if (!payload.times.length) {
    return {
      error: 'Нужно добавить хотя бы одно время в расписании',
    };
  }

  try {
    await saveScheduleFX({ ...payload, id: Number(params.id) });
  } catch (error) {
    return {
      error: 'Cannot update schedule',
    };
  }

  return redirect('/schedule');
};
