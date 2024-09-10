import { createEvent, createStore } from 'effector';
import { getAvailableGroupsFX } from './api';
import { AvailableGroupItem } from './types';

export const toggleGroup = createEvent<{ groupId: number }>();

export const $groups = createStore<{
  all: AvailableGroupItem[];
  selected: number[];
}>({
  all: [],
  selected: [],
});

$groups.on(getAvailableGroupsFX.doneData, (state, all) => ({
  ...state,
  all,
}));
$groups.on(toggleGroup, (state, { groupId }) => ({
  ...state,
  selected: state.selected.includes(groupId)
    ? state.selected.filter(sgId => sgId !== groupId)
    : state.selected.concat(groupId),
}));
