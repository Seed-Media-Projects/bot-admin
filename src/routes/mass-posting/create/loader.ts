import { getGroupPacksFX } from '@core/group-packs';
import { getGroupsFX } from '@core/groups';
import { getSchedulesFX } from '@core/schedule';

export const createMassPostingLoader = async () => {
  const [groups, groupPacks, schedules] = await Promise.all([getGroupsFX(), getGroupPacksFX(), getSchedulesFX()]);

  return { groups, groupPacks, schedules };
};
