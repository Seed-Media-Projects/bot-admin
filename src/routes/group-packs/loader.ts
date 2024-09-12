import { getGroupPacksFX } from '@core/group-packs';

export const groupPacksLoader = async () => {
  const groupPacks = await getGroupPacksFX();

  return { groupPacks };
};
