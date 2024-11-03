import { combine, createEvent, createStore } from 'effector';

type State = {
  links: { type: 'valid' | 'invalid'; value: string; groupId: number; postId: string }[];
};

export const changeLinks = createEvent<State['links']>();

export const $replaceLinks = createStore<State>({
  links: [],
});

export const $validLinks = combine($replaceLinks, l => l.links.filter(ll => ll.type === 'valid'));

$replaceLinks.on(changeLinks, (state, links) => ({
  ...state,
  links,
}));
