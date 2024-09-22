import { getGroupPacksFX } from '@core/group-packs';
import { getGroupsFX } from '@core/groups';
import { getStoryPackFX } from '@core/stories';
import { LoaderFunctionArgs } from 'react-router-dom';

export const editStoryPackLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) {
    return { groups: [], groupPacks: [], storyPack: null, stats: null };
  }
  const [groups, groupPacks, story] = await Promise.all([getGroupsFX(), getGroupPacksFX(), getStoryPackFX(params.id)]);

  return { groups, groupPacks, storyPack: story.storyPack, stats: story.stats };
};
