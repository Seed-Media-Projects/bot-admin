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
      {
        path: 'groups/:id',
        lazy: () => import('@routes/groups/edit'),
      },
      {
        path: 'group-packs',
        lazy: () => import('@routes/group-packs'),
      },
      {
        path: 'group-packs/create',
        lazy: () => import('@routes/group-packs/create'),
      },
      {
        path: 'group-packs/:id',
        lazy: () => import('@routes/group-packs/edit'),
      },
      {
        path: 'stories',
        lazy: () => import('@routes/stories'),
      },
      {
        path: 'stories/create',
        lazy: () => import('@routes/stories/create'),
      },
      {
        path: 'stories/:id',
        lazy: () => import('@routes/stories/edit'),
      },
      {
        path: 'posts',
        lazy: () => import('@routes/posts'),
      },
      {
        path: 'posts/create',
        lazy: () => import('@routes/posts/create'),
      },
      {
        path: 'posts/:id',
        lazy: () => import('@routes/posts/edit'),
      },
      {
        path: 'search-wall',
        lazy: () => import('@routes/search-wall'),
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
