import { createEvent, createStore } from 'effector';

export const showSnack = createEvent<{ message: string; severity: 'success' | 'info' | 'warning' | 'error' }>();
export const closeSnack = createEvent();

export const $snacks = createStore<{ open: boolean; message: string; severity: 'success' | 'info' | 'warning' | 'error' }>({
  open: false,
  message: '',
  severity: 'success',
});

$snacks.on(showSnack, (_, { message, severity }) => ({
  open: true,
  message,
  severity,
}));
$snacks.on(closeSnack, () => ({
  message: '',
  open: false,
  severity: 'success',
}));
