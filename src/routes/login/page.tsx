import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar, Box, Button, TextField } from '@mui/material';
import { Form, useActionData, useLocation, useNavigation } from 'react-router-dom';
import { loginAction } from './action';
import { loginLoader } from './loader';

const LoginPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const from = params.get('from') || '/';

  const navigation = useNavigation();
  const isLoggingIn = navigation.formData?.get('username') != null;

  const actionData = useActionData() as { error: string } | undefined;

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 500,
        margin: 'auto',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Form method="post" replace>
        <input type="hidden" name="redirectTo" value={from} />
        <TextField margin="normal" required fullWidth label="Username" name="username" autoFocus />
        <TextField margin="normal" required fullWidth label="Password" name="password" type="password" />

        <Button type="submit" variant="contained" disabled={isLoggingIn} sx={{ mt: 3, mb: 2 }}>
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </Button>

        {actionData && actionData.error ? <p style={{ color: 'red' }}>{actionData.error}</p> : null}
      </Form>
    </Box>
  );
};

export const Component = LoginPage;
export const loader = loginLoader;
export const action = loginAction;
