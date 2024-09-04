import { ChipProps } from '@mui/material';
import MuiChip from '@mui/material/Chip';
import { ColumnShape } from 'react-base-table';
import { UseBgColorType, useBgColor } from '../../usBgColor';
import { linearGradient } from '../../utils';
import { themeColors } from './constants';
import { ChipBundle, ThemeColor } from './types';

export type ChipWithColorProps = ChipProps & { tColor?: string; tFallbackColor: ThemeColor | string; tOpacity?: number };

export const CustomChip = (props: ChipWithColorProps) => {
  const { sx = {}, tColor = '#FFFFFF', tOpacity = 0.9, tFallbackColor, size = 'small', ...rest } = props;

  const bgColors = useBgColor();

  const colors: UseBgColorType = {
    primary: { ...bgColors.primaryLight },
    secondary: { ...bgColors.secondaryLight },
    success: { ...bgColors.successLight },
    error: { ...bgColors.errorLight },
    warning: { ...bgColors.warningLight },
    info: { ...bgColors.infoLight },
  };

  const color = themeColors.includes(tFallbackColor) ? colors[tFallbackColor] : undefined;

  return (
    <MuiChip
      {...rest}
      variant="filled"
      size={size}
      sx={{
        ...sx,
        color: color?.color ?? tFallbackColor,
        background: color?.backgroundColor ?? `${linearGradient(tColor, tOpacity, tFallbackColor)} !important`,
      }}
    />
  );
};

export function chipBundleColumn<
  T,
  K extends keyof T,
  RT extends T[K] extends string ? T[K] : never = T[K] extends string ? T[K] : never,
>(dataKey: K, bundle: Record<RT, ChipBundle>): ColumnShape<T> {
  return {
    key: String(dataKey),
    width: 125,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      const data = rowData[dataKey] as RT;
      return data ? (
        <CustomChip tFallbackColor={bundle[data].color} label={bundle[data].title} sx={{ textTransform: 'capitalize' }} />
      ) : null;
    },
  };
}

export function chipColumn<T extends ChipBundle>(): ColumnShape<T>;
export function chipColumn<T>(dataKey: keyof T): ColumnShape<T>;
export function chipColumn<T>(dataKey?: keyof T): ColumnShape<T> {
  return {
    key: dataKey ? String(dataKey) : '',
    width: 175,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      const obj = (dataKey ? rowData[dataKey] : rowData) as unknown as ChipBundle;
      if (!obj) return null;
      return <CustomChip tFallbackColor={obj.color} label={obj.title} sx={{ textTransform: 'capitalize' }} />;
    },
  };
}
