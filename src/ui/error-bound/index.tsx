import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Component } from 'react';
type LocalState = {
  hasError: boolean;
  error: unknown;
};

export class ErrorBoundary extends Component<{ children: React.ReactNode }, LocalState> {
  state: LocalState = { hasError: false, error: '' };

  static getDerivedStateFromError(error: unknown) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // You can also log the error to an error reporting service
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box style={{ textAlign: 'center' }}>
          <Typography variant="h5">Sorry, an unexpected error has occurred.</Typography>
          <Typography>{JSON.stringify(this.state.error)}</Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}
