import { getGroupPacksFX } from '@core/group-packs';
import { getGroupsFX } from '@core/groups';
import { getPostPacksFX } from '@core/posts';

export const postPacksLoader = async () => {
  const [groups, groupPacks, posts] = await Promise.all([getGroupsFX(), getGroupPacksFX(), getPostPacksFX()]);

  return { groups, groupPacks, posts };
};
