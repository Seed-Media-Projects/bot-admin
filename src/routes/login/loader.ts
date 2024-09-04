import { redirect } from 'react-router-dom';
import { LS, LSKeys } from '../../core/local-store';

export const loginLoader = async () => {
  if (LS.getItem(LSKeys.AuthToken, '')) {
    return redirect('/admin');
  }
  return null;
};
