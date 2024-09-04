import { createEffect } from 'effector';
import { AXPOSTER } from '../data/fetcher';
import { LS, LSKeys } from '../local-store';

export const signout = createEffect(() => {
  delete AXPOSTER.defaults.headers.common['Authorization'];
  LS.deleteItem(LSKeys.AuthToken);
});
