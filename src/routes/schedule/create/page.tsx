import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Form, useActionData, useNavigation } from 'react-router-dom';
import { createScheduleAction } from './action';

const CreateSchedule = () => {
  const navigation = useNavigation();
  const isLoading = navigation.formData?.get('name') != null;
  const [times, setTimes] = useState<string[]>([]);

  const actionData = useActionData() as { error: string } | undefined;

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
          Create schedule
        </Typography>
        <TextField margin="normal" required fullWidth label="Name" name="name" autoFocus />

        <input type="hidden" name="times" value={JSON.stringify(times)} />

        <Box>
          <Button variant="contained" color="secondary" onClick={() => setTimes(times.concat('10:00'))}>
            Добавить время
          </Button>
        </Box>

        {times.map((t, index) => (
          <TextField
            key={index}
            margin="normal"
            required
            fullWidth
            label="Time"
            type="time"
            value={t}
            onChange={e => setTimes(times.map((v, tIndex) => (tIndex === index ? e.target.value : v)))}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        ))}

        <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 3, mb: 2 }}>
          {isLoading ? <CircularProgress size={24} color="primary" /> : 'save'}
        </Button>

        {actionData && actionData.error ? <p style={{ color: 'red' }}>{actionData.error}</p> : null}
      </Box>
    </Form>
  );
};

export const Component = CreateSchedule;
export const action = createScheduleAction;
