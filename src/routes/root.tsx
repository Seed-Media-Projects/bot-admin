import { LS, LSKeys } from '@core/local-store';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Toolbar,
} from '@mui/material';
import { useUnit } from 'effector-react';
import { useState } from 'react';
import { LoaderFunctionArgs, Outlet, redirect, useFetcher } from 'react-router-dom';
import { $token } from '../core/login/store';
import { $snacks, closeSnack } from '../core/snacks/store';

export const Component = () => {
  const [open, setOpen] = useState(false);
  const hasToken = !!useUnit($token);
  const snacksStore = useUnit($snacks);
  const fetcher = useFetcher();

  const openMenu = () => {
    setOpen(true);
  };
  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              onClick={hasToken ? openMenu : undefined}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            {hasToken && (
              <fetcher.Form method="post" action="/logout" style={{ marginLeft: 'auto' }}>
                <Button type="submit" variant="contained" color="secondary">
                  Logout
                </Button>
              </fetcher.Form>
            )}
          </Toolbar>
        </AppBar>
        <Drawer open={open} onClose={closeMenu}>
          <Box sx={{ width: 250 }} role="presentation" onClick={closeMenu}>
            <List>
              <Link href="/" sx={{ textDecoration: 'none', color: 'MenuText' }}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Главная" />
                  </ListItemButton>
                </ListItem>
              </Link>
            </List>
          </Box>
        </Drawer>
      </Box>
      <Box sx={{ padding: 2 }}>
        <Outlet />
      </Box>
      <Snackbar open={snacksStore.open} autoHideDuration={6000} onClose={() => closeSnack()} message={snacksStore.message}>
        <Alert onClose={() => closeSnack()} severity={snacksStore.severity} variant="filled" sx={{ width: '100%' }}>
          {snacksStore.message}
        </Alert>
      </Snackbar>
    </>
  );
};

Component.displayName = 'Root';

export const loader = ({ request }: LoaderFunctionArgs) => {
  if (!LS.getItem(LSKeys.AuthToken, '')) {
    const params = new URLSearchParams();
    params.set('from', new URL(request.url).pathname);
    return redirect('/login?' + params.toString());
  }
  return null;
};
