import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title: string;
  subtitle: ReactNode;
  confirmColor?: 'secondary' | 'primary' | 'success' | 'error' | 'info' | 'warning';
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 400,
  bgcolor: 'background.paper',
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

export const ActionModal = ({ loading, onClose, onConfirm, open, subtitle, title, confirmColor = 'error' }: Props) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        {typeof subtitle === 'string' ? (
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {subtitle}
          </Typography>
        ) : (
          subtitle
        )}
        <Box display="flex" justifyContent="center" mt={2} gap={2}>
          <Button onClick={onClose} variant="contained" disabled={loading} color="secondary">
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading} variant="contained" color={confirmColor}>
            {loading ? <CircularProgress size={24} color="primary" /> : 'confirm'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
