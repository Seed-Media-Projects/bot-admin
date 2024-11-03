import { AXPOSTER } from '@core/data/fetcher';
import { createEffect } from 'effector';
import { CreateReplacePostDto, VkReplacePostDetail, VkReplacePostItem } from './types';

export const getReplacePostsFX = createEffect(async () => {
  const { data } = await AXPOSTER.get<VkReplacePostItem[]>(`/admin/api/replace-posts`);

  return data;
});
export const getReplacePostFX = createEffect(async (id: string) => {
  const { data } = await AXPOSTER.get<VkReplacePostDetail>(`/admin/api/replace-posts/${id}`);

  return data;
});

export const createReplacePostFX = createEffect(async (payload: CreateReplacePostDto) => {
  await AXPOSTER.post(`/admin/api/replace-posts`, payload);
});

export const deleteReplacePostFX = createEffect(async (id: string) => {
  await AXPOSTER.delete(`/admin/api/replace-posts/${id}`);
});
