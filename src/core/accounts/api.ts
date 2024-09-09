import { AXPOSTER } from '@core/data/fetcher';
import { createEffect } from 'effector';
import { AccountItem } from './types';

export const getAccountsFX = createEffect(async () => {
  const { data } = await AXPOSTER.get<AccountItem[]>('/admin/api/accounts');

  return data;
});
export const getAccountConnectLinkFX = createEffect(async () => {
  const { data } = await AXPOSTER.get<string>('/api/vk/auth/url');

  return data;
});

export const deleteAccountFX = createEffect(async (id: number) => {
  await AXPOSTER.delete(`/admin/api/accounts/${id}`);
});
