import { VkGroupItem } from '@core/groups';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  IconButton,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import { createGroupPackAction } from './action';
import { createGroupPackLoader } from './loader';

const CreateGroupPack = () => {
  const { groups } = useLoaderData() as { groups: VkGroupItem[] };
  const navigation = useNavigation();
  const [selectedGroupIds, setGroupIds] = useState<number[]>([]);
  const isLoading = navigation.formData?.get('name') != null;
  const [searchValue, setSearchValue] = useState('');
  const searchedList = groups.filter(v => v.name.toLowerCase().includes(searchValue.toLowerCase()));

  const actionData = useActionData() as { error: string } | undefined;

  const toggle = useCallback((groupId: number) => {
    setGroupIds(selected =>
      selected.includes(groupId) ? selected.filter(sgId => sgId !== groupId) : selected.concat(groupId),
    );
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Create group pack
      </Typography>

      <Form method="post">
        <TextField margin="normal" required fullWidth label="Name" name="name" autoFocus />

        <input type="hidden" name="groupIds" value={JSON.stringify(selectedGroupIds)} />

        <TextField onChange={e => setSearchValue(e.target.value)} sx={{ my: 1 }} placeholder="Search" value={searchValue} />

        <FormGroup>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Select groups*
          </Typography>
          {searchedList.map(g => (
            <FormControlLabel
              sx={{ mb: 2 }}
              key={g.id}
              control={<Checkbox checked={selectedGroupIds.includes(g.id)} onChange={() => toggle(g.id)} />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ mr: 1 }} src={g.photo} />
                  <ListItemText primary={g.name} />
                  <IconButton
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(`https://vk.com/club${g.groupId}`, '_blank');
                    }}
                  >
                    <OpenInNewIcon />
                  </IconButton>
                </Box>
              }
            />
          ))}
        </FormGroup>

        <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 3, mb: 2 }}>
          {isLoading ? <CircularProgress size={24} color="primary" /> : 'save'}
        </Button>

        {actionData && actionData.error ? <p style={{ color: 'red' }}>{actionData.error}</p> : null}
      </Form>
    </Box>
  );
};

export const Component = CreateGroupPack;
export const loader = createGroupPackLoader;
export const action = createGroupPackAction;
