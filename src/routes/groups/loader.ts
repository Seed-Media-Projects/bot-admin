import { getAccountsFX } from '@core/accounts';
import { getGroupsFX } from '@core/groups';
import { LoaderFunctionArgs } from 'react-router-dom';

export const groupsLoader = async ({ request }: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const searchTerm = searchParams.get('search');
  const [accounts, groups] = await Promise.all([getAccountsFX(), getGroupsFX(searchTerm ?? '')]);

  return { accounts, groups };
};
