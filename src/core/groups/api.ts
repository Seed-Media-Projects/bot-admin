import { AXPOSTER } from '@core/data/fetcher';
import { createEffect } from 'effector';
import { AvailableGroupItem, VkGroupItem } from './types';

export const getAvailableGroupsFX = createEffect(async (userId: number) => {
  const { data } = await AXPOSTER.get<AvailableGroupItem[]>(`/admin/api/groups/available/${userId}`);

  return data;
});

export const getGroupsFX = createEffect(async (search?: string) => {
  const { data } = await AXPOSTER.get<VkGroupItem[]>(`/admin/api/groups`, {
    params: {
      search,
    },
  });

  return data;
});
export const getGroupFX = createEffect(async (id: number) => {
  const { data } = await AXPOSTER.get<VkGroupItem>(`/admin/api/groups/group/${id}`);

  return data;
});

export const updateGroupFX = createEffect(async ({ groupId, userId }: { groupId: number; userId: number }) => {
  await AXPOSTER.put(`/admin/api/groups/${groupId}`, { userId });
});

export const connectGroupsFX = createEffect(async ({ groups, userId }: { groups: AvailableGroupItem[]; userId: number }) => {
  await AXPOSTER.post(`/admin/api/groups/${userId}`, { groups });
});

export const deleteGroupFX = createEffect(async (groupId: number) => {
  await AXPOSTER.delete(`/admin/api/groups/${groupId}`);
});
