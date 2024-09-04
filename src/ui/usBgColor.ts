import { useTheme } from '@mui/material/styles';
import { hex2rgba } from './utils';

export type UseBgColorType = {
  [key: string]: {
    color: string;
    backgroundColor: string;
  };
};

export const useBgColor = () => {
  const theme = useTheme();

  return {
    primaryFilled: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
    },
    primaryLight: {
      color: theme.palette.primary.main,
      backgroundColor: hex2rgba(theme.palette.primary.main, 0.12),
    },
    secondaryFilled: {
      color: theme.palette.secondary.contrastText,
      backgroundColor: theme.palette.secondary.main,
    },
    secondaryLight: {
      color: theme.palette.secondary.main,
      backgroundColor: hex2rgba(theme.palette.secondary.main, 0.12),
    },
    successFilled: {
      color: theme.palette.success.contrastText,
      backgroundColor: theme.palette.success.main,
    },
    successLight: {
      color: theme.palette.success.main,
      backgroundColor: hex2rgba(theme.palette.success.main, 0.12),
    },
    errorFilled: {
      color: theme.palette.error.contrastText,
      backgroundColor: theme.palette.error.main,
    },
    errorLight: {
      color: theme.palette.error.main,
      backgroundColor: hex2rgba(theme.palette.error.main, 0.12),
    },
    warningFilled: {
      color: theme.palette.warning.contrastText,
      backgroundColor: theme.palette.warning.main,
    },
    warningLight: {
      color: theme.palette.warning.main,
      backgroundColor: hex2rgba(theme.palette.warning.main, 0.12),
    },
    infoFilled: {
      color: theme.palette.info.contrastText,
      backgroundColor: theme.palette.info.main,
    },
    infoLight: {
      color: theme.palette.info.main,
      backgroundColor: hex2rgba(theme.palette.info.main, 0.12),
    },
  };
};
