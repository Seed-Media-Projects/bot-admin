import { getGroupPackFX } from '@core/group-packs';
import { getGroupsFX } from '@core/groups';
import { LoaderFunctionArgs } from 'react-router-dom';

export const editGroupPackLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) {
    return { pack: null };
  }
  const [pack, groups] = await Promise.all([getGroupPackFX(Number(params.id)), getGroupsFX()]);

  return { groups, pack };
};
