import { signout } from '@core/login/signout';
import { ErrorBoundary } from '@ui/error-bound';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { ErrorPage } from './error-page';

const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('@routes/root'),
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        lazy: () => import('@routes/home'),
      },
      {
        path: 'accounts',
        lazy: () => import('@routes/accounts'),
      },
      {
        path: 'groups',
        lazy: () => import('@routes/groups'),
      },
      {
        path: 'groups/connect',
        lazy: () => import('@routes/groups/connect'),
      },
    ],
  },
  {
    path: '/login',
    lazy: () => import('@routes/login'),
  },
  {
    path: '/logout',
    async action() {
      signout();
      return redirect('/login');
    },
  },
]);

export const App = () => {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};
