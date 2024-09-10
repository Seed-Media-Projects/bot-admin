import { AccountItem } from '@core/accounts';
import { $groups, getAvailableGroupsFX, toggleGroup } from '@core/groups';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useUnit } from 'effector-react';
import { useEffect, useState } from 'react';
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import { connectGroupsAction } from './action';
import { groupsConnectLoader } from './loader';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const ConnectGroups = () => {
  const { accounts } = useLoaderData() as { accounts: AccountItem[] };
  const [selectedAcc, setSelectedAcc] = useState<number | undefined>(undefined);
  const loadingGroups = useUnit(getAvailableGroupsFX.pending);
  const { all, selected } = useUnit($groups);
  const navigation = useNavigation();
  const isLoading = navigation.formData?.get('userId') != null;

  const actionData = useActionData() as { error: string } | undefined;

  useEffect(() => {
    $groups.reinit();
  }, []);

  useEffect(() => {
    if (selectedAcc) {
      getAvailableGroupsFX(selectedAcc);
    }
  }, [selectedAcc]);

  const handleChange = (event: SelectChangeEvent<typeof selectedAcc>) => {
    const {
      target: { value },
    } = event;
    setSelectedAcc(Number(value));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Connect groups
      </Typography>

      <Box display="flex" alignItems="center" gap={4} mb={4}>
        <FormControl sx={{ mt: 2, width: 300 }}>
          <InputLabel id="select_acc">Account</InputLabel>
          <Select
            labelId="select_acc"
            id="select-acc"
            value={selectedAcc}
            onChange={handleChange}
            input={<OutlinedInput label="Account" />}
            MenuProps={MenuProps}
          >
            {accounts.map(acc => (
              <MenuItem key={acc.id} value={acc.id}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ mr: 1 }} src={acc.vkInfo?.avatar} />
                  <ListItemText primary={acc.vkInfo?.name} />
                </Box>
              </MenuItem>
            ))}
          </Select>
          {!selectedAcc ? <FormHelperText>Нужно выбрать акк, чтобы подключить группы</FormHelperText> : null}
        </FormControl>
        {loadingGroups ? <CircularProgress size={24} color="secondary" /> : null}
      </Box>

      <Form method="post">
        <input type="hidden" name="groups" value={JSON.stringify(all.filter(ag => selected.includes(ag.id)))} />
        <input type="hidden" name="userId" value={selectedAcc} />
        <FormGroup>
          {all.map(g => (
            <FormControlLabel
              key={g.id}
              control={<Checkbox checked={selected.includes(g.id)} onChange={() => toggleGroup({ groupId: g.id })} />}
              label={g.name}
            />
          ))}
        </FormGroup>

        <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 3, mb: 2 }}>
          {isLoading ? <CircularProgress size={24} color="primary" /> : 'connect'}
        </Button>

        {actionData && actionData.error ? <p style={{ color: 'red' }}>{actionData.error}</p> : null}
      </Form>
    </Box>
  );
};

export const Component = ConnectGroups;
export const loader = groupsConnectLoader;
export const action = connectGroupsAction;
