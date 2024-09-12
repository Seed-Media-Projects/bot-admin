import { AXPOSTER } from '@core/data/fetcher';
import { createEffect } from 'effector';
import { GroupPackDetail, GroupPackItem, SaveGroupPackPayload } from './types';

export const getGroupPacksFX = createEffect(async () => {
  const { data } = await AXPOSTER.get<GroupPackItem[]>(`/admin/api/group-packs`);

  return data;
});
export const getGroupPackFX = createEffect(async (id: number) => {
  const { data } = await AXPOSTER.get<GroupPackDetail>(`/admin/api/group-packs/${id}`);

  return data;
});

export const createGroupPackFX = createEffect(async (payload: SaveGroupPackPayload) => {
  await AXPOSTER.post(`/admin/api/group-packs`, payload);
});
export const saveGroupPackFX = createEffect(async ({ id, ...payload }: SaveGroupPackPayload & { id: number }) => {
  await AXPOSTER.put(`/admin/api/group-packs/${id}`, payload);
});

export const deleteGroupPackFX = createEffect(async (id: number) => {
  await AXPOSTER.delete(`/admin/api/group-packs/${id}`);
});
