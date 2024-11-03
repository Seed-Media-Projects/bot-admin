export const extractIds = (url: string): { groupId: string; postId: string } | null => {
  const regex = /wall-(\d+)_(\d+)/;
  const match = url.match(regex);

  if (match && match.length === 3) {
    const groupId = match[1];
    const postId = match[2];
    return { groupId, postId };
  }

  return null;
};
