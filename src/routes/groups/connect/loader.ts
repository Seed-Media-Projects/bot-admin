import { getAccountsFX } from '@core/accounts';

export const groupsConnectLoader = async () => {
  const accounts = await getAccountsFX();

  return { accounts };
};
