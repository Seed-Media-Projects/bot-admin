import { SvgIcon } from '@mui/material';

export type ThemeColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
export type MIconType = typeof SvgIcon;
export type ChipBundle = {
  color: ThemeColor | string;
  title: string;
};
export type AvaStatusBundle = {
  color: ThemeColor;
  icon: MIconType;
  tooltip?: string;
};
