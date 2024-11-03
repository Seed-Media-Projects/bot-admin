import { getGroupsFX } from '@core/groups';
import { getReplacePostFX } from '@core/replace-posts';
import { LoaderFunctionArgs } from 'react-router-dom';

export const editReplacePostLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) {
    return { groups: [], replacePostData: null };
  }
  const [groups, replacePostData] = await Promise.all([getGroupsFX(), getReplacePostFX(params.id)]);

  return { groups, replacePostData };
};
