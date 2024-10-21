import { getGroupPacksFX } from '@core/group-packs';
import { getGroupsFX } from '@core/groups';
import { getMassPostingsFX } from '@core/mass-posting';

export const massPostingsLoader = async () => {
  const [groups, groupPacks, massPostings] = await Promise.all([getGroupsFX(), getGroupPacksFX(), getMassPostingsFX()]);

  return { groups, groupPacks, massPostings };
};
