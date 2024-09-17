import { AccountItem } from '@core/accounts';
import { VkGroupItem } from '@core/groups';
import { Avatar, Box, Button, CircularProgress, ListItemText, MenuItem, TextField, Typography } from '@mui/material';
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import { updateGroupAction } from './action';
import { groupEditLoader } from './loader';

const UpdateGroup = () => {
  const { accounts, group } = useLoaderData() as { accounts: AccountItem[]; group: VkGroupItem | null };
  const navigation = useNavigation();
  const isLoading = navigation.formData?.get('userId') != null;

  const actionData = useActionData() as { error: string } | undefined;

  if (!group) {
    return <Typography>Group not found</Typography>;
  }

  return (
    <Form method="post">
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
        <Typography variant="h6" gutterBottom>
          Updatge group {group.name}
        </Typography>

        <TextField margin="normal" select name="userId" defaultValue={accounts.find(a => a.vkUserId === group.vkUserId)?.id}>
          {accounts.map(acc => (
            <MenuItem key={acc.id} value={acc.id}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 1 }} src={acc.vkInfo?.avatar} />
                <ListItemText primary={acc.vkInfo?.name} />
              </Box>
            </MenuItem>
          ))}
        </TextField>

        <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 3, mb: 2 }}>
          {isLoading ? <CircularProgress size={24} color="primary" /> : 'update'}
        </Button>

        {actionData && actionData.error ? <p style={{ color: 'red' }}>{actionData.error}</p> : null}
      </Box>
    </Form>
  );
};

export const Component = UpdateGroup;
export const loader = groupEditLoader;
export const action = updateGroupAction;
