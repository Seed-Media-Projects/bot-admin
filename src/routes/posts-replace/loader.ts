import { getGroupsFX } from '@core/groups';
import { getReplacePostsFX } from '@core/replace-posts';

export const postsReplaceLoader = async () => {
  const [groups, posts] = await Promise.all([getGroupsFX(), getReplacePostsFX()]);

  return { posts, groups };
};
