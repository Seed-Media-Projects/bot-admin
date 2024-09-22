import { GroupPackItem } from '@core/group-packs';
import { VkGroupItem } from '@core/groups';
import { Box, Button, CircularProgress, MenuItem, TextField, Typography } from '@mui/material';
import { postTargetOptions } from '@routes/posts/constants';
import { useState } from 'react';
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import { adsAction } from './action';
import { adsLoader } from './loader';

const adsTargetOptions = [
  {
    title: 'Сбор прямой рекламы',
    value: '1',
  },
  {
    title: 'Сбор нативной рекламы',
    value: '2',
  },
];

const AdsPage = () => {
  const { groups, groupPacks } = useLoaderData() as { groups: VkGroupItem[]; groupPacks: GroupPackItem[] };
  const [postTarget, setPostTarget] = useState<'toAllGroups' | 'groupPacks' | 'group'>('groupPacks');
  const [adsTarget, setAdsTarget] = useState<'1' | '2'>('1');

  const navigation = useNavigation();
  const isLoading = navigation.formData?.get('query') != null;

  const actionData = useActionData() as { error: string } | { success: boolean };

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
      <Typography variant="h5" gutterBottom>
        Сбор рекламы
      </Typography>
      <Form method="post" style={{ width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          select
          label="Тип рекламы"
          value={adsTarget}
          onChange={e => setAdsTarget(e.target.value as typeof adsTarget)}
        >
          {adsTargetOptions.map(o => (
            <MenuItem key={o.value} value={o.value}>
              {o.title}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="normal"
          required
          fullWidth
          select
          label="Где?"
          name="postTarget"
          value={postTarget}
          onChange={e => setPostTarget(e.target.value as typeof postTarget)}
        >
          {postTargetOptions.map(o => (
            <MenuItem key={o.value} value={o.value}>
              {o.title}
            </MenuItem>
          ))}
        </TextField>

        {postTarget === 'groupPacks' ? (
          <TextField margin="normal" required fullWidth select label="Group packs" name="groupPackId">
            {groupPacks.map(o => (
              <MenuItem key={o.id} value={o.id}>
                {o.name}
              </MenuItem>
            ))}
          </TextField>
        ) : null}
        {postTarget === 'group' ? (
          <TextField margin="normal" required fullWidth select label="Group" name="groupId">
            {groups.map(o => (
              <MenuItem key={o.id} value={o.id}>
                {o.name}
              </MenuItem>
            ))}
          </TextField>
        ) : null}

        <TextField margin="normal" fullWidth label="Поисковой запрос" name="query" type="text" />

        {adsTarget === '1' ? (
          <TextField
            margin="normal"
            fullWidth
            label="Дата"
            name="date"
            type="date"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        ) : (
          <>
            <TextField
              margin="normal"
              fullWidth
              label="От"
              name="from"
              type="datetime-local"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="До"
              name="to"
              type="datetime-local"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </>
        )}

        <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 3, mb: 2 }}>
          {isLoading ? <CircularProgress size={24} color="primary" /> : 'Найти'}
        </Button>

        {actionData && 'error' in actionData ? <p style={{ color: 'red' }}>{actionData.error}</p> : null}
      </Form>
    </Box>
  );
};

export const loader = adsLoader;
export const Component = AdsPage;
export const action = adsAction;
