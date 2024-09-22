import { getGroupPacksFX } from '@core/group-packs';
import { getGroupsFX } from '@core/groups';

export const adsLoader = async () => {
  const [groups, groupPacks] = await Promise.all([getGroupsFX(), getGroupPacksFX()]);

  return { groups, groupPacks };
};
