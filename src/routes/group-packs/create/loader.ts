import { getGroupsFX } from '@core/groups';

export const createGroupPackLoader = async () => {
  const groups = await getGroupsFX();

  return { groups };
};
