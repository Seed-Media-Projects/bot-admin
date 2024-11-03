import { getGroupsFX } from '@core/groups';

export const createPostReplaceLoader = async () => {
  const groups = await getGroupsFX();

  return { groups };
};
