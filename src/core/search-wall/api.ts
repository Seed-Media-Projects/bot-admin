import { AXPOSTER } from '@core/data/fetcher';
import { createEffect } from 'effector';
import { VkWallSearch } from './types';

export const searchWallRequestFX = createEffect(async (payload: VkWallSearch) => {
  await AXPOSTER.post(`/admin/api/wall-search`, payload);
});
