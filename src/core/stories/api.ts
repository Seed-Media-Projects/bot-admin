import { AXPOSTER } from '@core/data/fetcher';
import { createEffect } from 'effector';
import { CreateStoryDto, VkStoryPackDetail, VkStoryPackItem, VkStoryStats } from './types';

export const getStoryPacksFX = createEffect(async () => {
  const { data } = await AXPOSTER.get<VkStoryPackItem[]>(`/admin/api/stories`);

  return data;
});
export const getStoryPackFX = createEffect(async (id: string) => {
  const { data } = await AXPOSTER.get<{ storyPack: VkStoryPackDetail; stats: Record<number, VkStoryStats> }>(
    `/admin/api/stories/${id}`,
  );

  return data;
});

export const createStoryPackFX = createEffect(async (payload: CreateStoryDto) => {
  await AXPOSTER.post(`/admin/api/stories`, payload);
});
export const stopStoryJobsPackFX = createEffect(async (id: string) => {
  await AXPOSTER.post(`/admin/api/stories/jobs/stop/${id}`);
});

export const deleteStoryPackFX = createEffect(async (id: string) => {
  await AXPOSTER.delete(`/admin/api/stories/${id}`);
});
export const deleteSpecificVkStoryFX = createEffect(
  async ({ groupId, id, vkStoryId }: { id: string; groupId: number; vkStoryId: number }) => {
    await AXPOSTER.delete(`/admin/api/stories/specific/${id}/${groupId}/${vkStoryId}`);
  },
);
