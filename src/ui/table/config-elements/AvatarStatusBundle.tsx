import { AvatarProps, Box, Tooltip } from '@mui/material';
import MuiAvatar from '@mui/material/Avatar';
import { ColumnShape } from 'react-base-table';
import { UseBgColorType, useBgColor } from '../../usBgColor';
import { linearGradient } from '../../utils';
import { AvaStatusBundle, ThemeColor } from './types';

export type AvatarWithColorProps = AvatarProps & { color: ThemeColor; tFallbackColor?: string; tOpacity?: number };

export const CustomAvatar = (props: AvatarWithColorProps) => {
  const { sx = {}, color, tOpacity = 0.88, tFallbackColor = '#ffffff', ...rest } = props;

  const bgColors = useBgColor();

  const getAvatarStyles = (skinColor: ThemeColor) => {
    return { ...bgColors[`${skinColor}Light`] };
  };

  const colors: UseBgColorType = {
    primary: getAvatarStyles('primary'),
    secondary: getAvatarStyles('secondary'),
    success: getAvatarStyles('success'),
    error: getAvatarStyles('error'),
    warning: getAvatarStyles('warning'),
    info: getAvatarStyles('info'),
  };

  return (
    <MuiAvatar
      {...rest}
      sx={{
        ...sx,
        color: colors[color].color,
        background: `${linearGradient(tFallbackColor, tOpacity, colors[color].color)} !important`,
      }}
    />
  );
};

export function avatarStatusBundleColumn<
  T,
  K extends keyof T,
  RT extends T[K] extends string ? T[K] : never = T[K] extends string ? T[K] : never,
>(dataKey: K, bundle: Record<RT, AvaStatusBundle>): ColumnShape<T> {
  return {
    key: String(dataKey),
    width: 100,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      const data = rowData[dataKey] as RT;

      if (typeof data === 'undefined' || data === null) return 'pls update bundle of type ' + String(dataKey);
      if (!bundle[data]) return 'pls update bundle of type ' + String(data);

      const Icon = bundle[data].icon;
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
          <CustomAvatar color={bundle[data].color}>
            <Tooltip title={bundle[data].tooltip ?? ''} placement="top" arrow>
              <Icon />
            </Tooltip>
          </CustomAvatar>
        </Box>
      );
    },
  };
}
