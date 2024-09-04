import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { sigin } from '../../core/login/signin';

export const loginAction = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const username = formData.get('username') as string | null;
  const password = formData.get('password') as string | null;

  // Validate our form inputs and return validation errors via useActionData()
  if (!username) {
    return {
      error: 'You must provide a username to log in',
    };
  }
  if (!password) {
    return {
      error: 'You must provide a password to log in',
    };
  }

  // Sign in and redirect to the proper destination if successful.
  try {
    await sigin({ username, password });
  } catch (error) {
    return {
      error: 'Invalid login attempt',
    };
  }

  const redirectTo = formData.get('redirectTo') as string | null;
  return redirect(redirectTo || '/admin');
};
