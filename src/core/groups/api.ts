import { AXPOSTER } from '@core/data/fetcher';
import { createEffect } from 'effector';
import { AvailableGroupItem, VkGroupItem } from './types';

export const getAvailableGroupsFX = createEffect(async (userId: number) => {
  const { data } = await AXPOSTER.get<AvailableGroupItem[]>(`/admin/api/groups/available/${userId}`);

  return data;
});

export const getGroupsFX = createEffect(async () => {
  const { data } = await AXPOSTER.get<VkGroupItem[]>(`/admin/api/groups`);

  return data;
});
export const connectGroupsFX = createEffect(async ({ groups, userId }: { groups: AvailableGroupItem[]; userId: number }) => {
  await AXPOSTER.post(`/admin/api/groups/${userId}`, { groups });
});

export const deleteGroupFX = createEffect(async (groupId: string) => {
  await AXPOSTER.delete(`/admin/api/groups/${groupId}`);
});
