import { buildQueryString } from './query-string';

export const getDiceBearAvatar = (
  seed: string,
  sprites: 'avataaars' | 'initials' | 'big-smile' | 'adventurer' = 'initials',
  q: { background?: string } = {},
) => `https://api.dicebear.com/7.x/${sprites}/svg${buildQueryString({ ...q, seed })}`;
