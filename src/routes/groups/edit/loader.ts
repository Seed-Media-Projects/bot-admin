import { getAccountsFX } from '@core/accounts';
import { getGroupFX } from '@core/groups';
import { LoaderFunctionArgs } from 'react-router-dom';

export const groupEditLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) {
    return { accounts: [], group: null };
  }
  const [accounts, group] = await Promise.all([getAccountsFX(), getGroupFX(Number(params.id))]);

  return { accounts, group };
};
