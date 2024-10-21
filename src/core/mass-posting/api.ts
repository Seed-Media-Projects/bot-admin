import { AXPOSTER } from '@core/data/fetcher';
import { createEffect } from 'effector';
import { CreateMassPostingDto, VkMassPosting, VkMassPostingDetail } from './types';

export const getMassPostingsFX = createEffect(async () => {
  const { data } = await AXPOSTER.get<VkMassPosting[]>(`/admin/api/mass-posting`);

  return data;
});
export const getMassPostingFX = createEffect(async (id: string) => {
  const { data } = await AXPOSTER.get<{ massPosting: VkMassPostingDetail }>(`/admin/api/mass-posting/${id}`);

  return data;
});

export const createMassPostingFX = createEffect(async (payload: CreateMassPostingDto) => {
  await AXPOSTER.post(`/admin/api/mass-posting`, payload);
});

export const deleteMassPostingFX = createEffect(async (id: string) => {
  await AXPOSTER.delete(`/admin/api/mass-posting/${id}`);
});
