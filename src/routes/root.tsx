import { LS, LSKeys } from '@core/local-store';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import MenuIcon from '@mui/icons-material/Menu';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
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
  const { snacks } = useUnit($snacks);
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
              <Link href="/accounts" sx={{ textDecoration: 'none', color: 'MenuText' }}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <AccountBoxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Акки" />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link href="/groups" sx={{ textDecoration: 'none', color: 'MenuText' }}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <GroupsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Группы" />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link href="/group-packs" sx={{ textDecoration: 'none', color: 'MenuText' }}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <InventoryIcon />
                    </ListItemIcon>
                    <ListItemText primary="Паки" />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link href="/posts" sx={{ textDecoration: 'none', color: 'MenuText' }}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <DynamicFeedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Посты" />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link href="/stories" sx={{ textDecoration: 'none', color: 'MenuText' }}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <PhoneIphoneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Сторисы" />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link href="/search-wall" sx={{ textDecoration: 'none', color: 'MenuText' }}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <AdsClickIcon />
                    </ListItemIcon>
                    <ListItemText primary="Сбор рекламы" />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link href="/schedule" sx={{ textDecoration: 'none', color: 'MenuText' }}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <CalendarMonthIcon />
                    </ListItemIcon>
                    <ListItemText primary="Расписание" />
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
      {snacks.map(snack => (
        <Snackbar
          key={snack.message}
          open
          autoHideDuration={6000}
          onClose={() => closeSnack({ id: snack.id })}
          message={snack.message}
        >
          <Alert
            onClose={() => closeSnack({ id: snack.id })}
            severity={snack.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
      ))}
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
