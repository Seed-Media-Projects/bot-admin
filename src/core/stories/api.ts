import { AXPOSTER } from '@core/data/fetcher';
import { createEffect } from 'effector';
import { CreateStoryDto, VkStoryPackDetail, VkStoryPackItem } from './types';

export const getStoryPacksFX = createEffect(async () => {
  const { data } = await AXPOSTER.get<VkStoryPackItem[]>(`/admin/api/stories`);

  return data;
});
export const getStoryPackFX = createEffect(async (id: string) => {
  const { data } = await AXPOSTER.get<VkStoryPackDetail>(`/admin/api/stories/${id}`);

  return data;
});

export const createStoryPackFX = createEffect(async (payload: CreateStoryDto) => {
  await AXPOSTER.post(`/admin/api/stories`, payload);
});

export const deleteStoryPackFX = createEffect(async (id: string) => {
  await AXPOSTER.delete(`/admin/api/stories/${id}`);
});
