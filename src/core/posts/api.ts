import { AXPOSTER } from '@core/data/fetcher';
import { createEffect } from 'effector';
import { CreatePostDto, VkPostPackDetailResponse, VkPostPackItem } from './types';

export const getPostPacksFX = createEffect(async () => {
  const { data } = await AXPOSTER.get<VkPostPackItem[]>(`/admin/api/posts`);

  return data;
});
export const getPostPackFX = createEffect(async (id: number) => {
  const { data } = await AXPOSTER.get<VkPostPackDetailResponse>(`/admin/api/posts/${id}`);

  return data;
});

export const createPostPackFX = createEffect(async (payload: CreatePostDto) => {
  await AXPOSTER.post(`/admin/api/posts`, payload);
});

export const deletePostPackFX = createEffect(async (id: number) => {
  await AXPOSTER.delete(`/admin/api/posts/${id}`);
});
