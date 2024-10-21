import { getGroupPacksFX } from '@core/group-packs';
import { getGroupsFX } from '@core/groups';
import { getMassPostingFX } from '@core/mass-posting';
import { getSchedulesFX } from '@core/schedule';
import { LoaderFunctionArgs } from 'react-router-dom';

export const editMassPostingLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) {
    return { groups: [], groupPacks: [], massPostingData: null };
  }

  const [groups, groupPacks, schedules, { massPosting }] = await Promise.all([
    getGroupsFX(),
    getGroupPacksFX(),
    getSchedulesFX(),
    getMassPostingFX(params.id),
  ]);

  return { groups, groupPacks, schedules, massPostingData: massPosting };
};
