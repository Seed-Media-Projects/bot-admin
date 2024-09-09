import { getAccountsFX } from '@core/accounts';

export const accountsLoader = async () => {
  const accounts = await getAccountsFX();
  return { accounts };
};
