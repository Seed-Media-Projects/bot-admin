import { AXPOSTER } from '@core/data/fetcher';
import { createEffect } from 'effector';
import { SaveSchedulePayload, ScheduleDetail, ScheduleItem } from './types';

export const getSchedulesFX = createEffect(async () => {
  const { data } = await AXPOSTER.get<ScheduleItem[]>(`/admin/api/schedule`);

  return data;
});
export const getScheduleFX = createEffect(async (id: number) => {
  const { data } = await AXPOSTER.get<ScheduleDetail>(`/admin/api/schedule/${id}`);

  return data;
});

export const createScheduleFX = createEffect(async (payload: SaveSchedulePayload) => {
  await AXPOSTER.post(`/admin/api/schedule`, payload);
});
export const saveScheduleFX = createEffect(async ({ id, ...payload }: SaveSchedulePayload & { id: number }) => {
  await AXPOSTER.put(`/admin/api/schedule/${id}`, payload);
});

export const deleteScheduleFX = createEffect(async (id: number) => {
  await AXPOSTER.delete(`/admin/api/schedule/${id}`);
});
