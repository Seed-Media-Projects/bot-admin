import { getAccountsFX } from '@core/accounts';
import { getGroupsFX } from '@core/groups';

export const groupsLoader = async () => {
  const [accounts, groups] = await Promise.all([getAccountsFX(), getGroupsFX()]);

  return { accounts, groups };
};
