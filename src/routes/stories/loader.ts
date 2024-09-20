import { getGroupPacksFX } from '@core/group-packs';
import { getGroupsFX } from '@core/groups';
import { getStoryPacksFX } from '@core/stories';

export const storyPacksLoader = async () => {
  const [groups, groupPacks, stories] = await Promise.all([getGroupsFX(), getGroupPacksFX(), getStoryPacksFX()]);

  return { groups, groupPacks, stories };
};
