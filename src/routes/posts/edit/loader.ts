import { getGroupPacksFX } from '@core/group-packs';
import { getGroupsFX } from '@core/groups';
import { getPostPackFX } from '@core/posts';
import { LoaderFunctionArgs } from 'react-router-dom';

export const editPostPackLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) {
    return { groups: [], groupPacks: [], postData: null };
  }
  const [groups, groupPacks, postData] = await Promise.all([getGroupsFX(), getGroupPacksFX(), getPostPackFX(params.id)]);

  return { groups, groupPacks, postData };
};
