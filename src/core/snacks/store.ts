import { createEvent, createStore } from 'effector';

export const showSnack = createEvent<SnackState>();
export const closeSnack = createEvent<{ id: string }>();

type SnackState = { message: string; severity: 'success' | 'info' | 'warning' | 'error'; id: string };

export const $snacks = createStore<{ snacks: SnackState[] }>({
  snacks: [],
});

$snacks.on(showSnack, (state, { message, severity, id }) => ({
  snacks: state.snacks.concat({
    id,
    message,
    severity,
  }),
}));
$snacks.on(closeSnack, (state, { id }) => ({
  snacks: state.snacks.filter(s => s.id !== id),
}));
