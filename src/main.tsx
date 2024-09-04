import { signout } from '@core/login/signout';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { ErrorBoundary } from '@ui/error-bound';
import { theme } from '@ui/theme';
import { StrictMode } from 'react';
import 'react-base-table/styles.css';
import { createRoot } from 'react-dom/client';
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>,
);
