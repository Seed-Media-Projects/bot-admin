import { GroupPackDetail } from '@core/group-packs';
import { VkGroupItem } from '@core/groups';
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, TextField, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import { editGroupPackAction } from './action';
import { editGroupPackLoader } from './loader';

const EditGroupPack = () => {
  const { groups, pack } = useLoaderData() as { groups: VkGroupItem[]; pack: GroupPackDetail | null };
  const navigation = useNavigation();
  const [selectedGroupIds, setGroupIds] = useState<number[]>(pack?.packItems.map(v => v.group.id) ?? []);
  const isLoading = navigation.formData?.get('name') != null;

  const actionData = useActionData() as { error: string } | undefined;

  const toggle = useCallback((groupId: number) => {
    setGroupIds(selected =>
      selected.includes(groupId) ? selected.filter(sgId => sgId !== groupId) : selected.concat(groupId),
    );
  }, []);

  if (!pack) {
    return <Typography>Group pack not found</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Edit group pack
      </Typography>

      <Form method="post">
        <TextField margin="normal" required fullWidth label="Name" name="name" autoFocus defaultValue={pack.name} />

        <input type="hidden" name="groupIds" value={JSON.stringify(selectedGroupIds)} />
        <FormGroup>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Select groups*
          </Typography>
          {groups.map(g => (
            <FormControlLabel
              key={g.id}
              control={<Checkbox checked={selectedGroupIds.includes(g.id)} onChange={() => toggle(g.id)} />}
              label={g.name}
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

export const Component = EditGroupPack;
export const loader = editGroupPackLoader;
export const action = editGroupPackAction;