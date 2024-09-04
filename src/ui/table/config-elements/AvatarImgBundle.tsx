import { Avatar, Box, SxProps, Theme } from '@mui/material';
import { ColumnShape } from 'react-base-table';

export function avatarImgBundleColumn<
  T,
  K extends keyof T,
  RT extends T[K] extends string ? T[K] : never = T[K] extends string ? T[K] : never,
>(config: { dataKey: K; renderValueKey: keyof RT; sx?: SxProps<Theme> }): ColumnShape<T> {
  const { renderValueKey, dataKey, sx } = config;
  return {
    key: String(dataKey),
    width: 100,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      const data = rowData[dataKey] as RT;

      if (typeof data === 'undefined' || data === null) return 'pls update bundle of type ' + String(dataKey);
      if (!data[renderValueKey]) return 'pls update bundle of type ' + String(data);

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
          <Avatar src={data[renderValueKey] as string} sx={sx} />
        </Box>
      );
    },
  };
}
export function avatarImgColumn<T, K extends keyof T>(config: { dataKey: K; sx?: SxProps<Theme> }): ColumnShape<T> {
  const { dataKey, sx } = config;
  return {
    key: String(dataKey),
    width: 100,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      const data = rowData[dataKey] as unknown as string;

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
          <Avatar src={data} sx={sx} />
        </Box>
      );
    },
  };
}
