import { createStore } from 'effector';
import { LS, LSKeys } from '../local-store';
import { sigin } from './signin';
import { signout } from './signout';

export const $token = createStore(LS.getItem(LSKeys.AuthToken, ''));

$token.on(sigin.doneData, (_, data) => data);
$token.on(signout.done, () => '');
