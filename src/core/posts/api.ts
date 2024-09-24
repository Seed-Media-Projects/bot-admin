import { AXPOSTER } from '@core/data/fetcher';
import { createEffect } from 'effector';
import { CreatePostDto, VkPostPackDetailResponse, VkPostPackItem } from './types';

export const getPostPacksFX = createEffect(async () => {
  const { data } = await AXPOSTER.get<VkPostPackItem[]>(`/admin/api/posts`);

  return data;
});
export const getPostPackFX = createEffect(async (id: string) => {
  const { data } = await AXPOSTER.get<VkPostPackDetailResponse>(`/admin/api/posts/${id}`);

  return data;
});

export const createPostPackFX = createEffect(async (payload: CreatePostDto) => {
  await AXPOSTER.post(`/admin/api/posts`, payload);
});

export const stopPostJobsPackFX = createEffect(async (id: string) => {
  await AXPOSTER.post(`/admin/api/posts/jobs/stop/${id}`);
});

export const deletePostPackFX = createEffect(async (id: string) => {
  await AXPOSTER.delete(`/admin/api/posts/${id}`);
});

export const deleteSpecificVkPostFX = createEffect(
  async ({ groupId, id, vkPostId }: { id: string; groupId: number; vkPostId: number }) => {
    await AXPOSTER.delete(`/admin/api/posts/specific/${id}/${groupId}/${vkPostId}`);
  },
);
