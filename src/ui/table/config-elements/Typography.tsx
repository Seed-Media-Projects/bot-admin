import { Box, SxProps, Theme, Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import dayjs from 'dayjs';
import { ColumnShape } from 'react-base-table';

type Props<T> = {
  dataKey: keyof T;
  prefix?: keyof T;
  prefixContent?: React.ReactNode;
  formatString?: string;
};

export function typographyStinColumn<T>({ dataKey, prefix, prefixContent }: Props<T>): ColumnShape<T> {
  return {
    key: String(dataKey),
    width: 200,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      return (
        <Typography noWrap variant="body2">
          {prefixContent}
          {prefix && (rowData[prefix] as unknown as React.ReactNode)}
          {rowData[dataKey] as unknown as React.ReactNode}
        </Typography>
      );
    },
  };
}

export function typographyDateColumn<T>({ dataKey, formatString = 'DD MMM YYYY HH:mm' }: Props<T>): ColumnShape<T> {
  return {
    key: String(dataKey),
    width: 200,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      if (!rowData[dataKey]) return null;

      return (
        <Typography noWrap variant="body2">
          {dayjs(rowData[dataKey] as unknown as string).format(formatString)}
        </Typography>
      );
    },
  };
}

export function typographyColumn<T>({ dataKey }: Props<T>): ColumnShape<T> {
  return {
    key: String(dataKey),

    width: 200,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      return <Typography sx={{ textTransform: 'capitalize' }}>{rowData[dataKey] as unknown as React.ReactNode}</Typography>;
    },
  };
}
export function typographyColumnToKey<
  T,
  K extends keyof T = keyof T,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  RT extends T[K] extends string ? T[K] : never = T[K],
>(dataKey: K, renderValueKey: keyof RT): ColumnShape<T> {
  return {
    key: String(dataKey) + String(renderValueKey),
    width: 200,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      const obj = rowData[dataKey] as unknown as RT;
      if (!obj) return null;
      return <Typography>{obj[renderValueKey] as unknown as React.ReactNode}</Typography>;
    },
  };
}

type MultiLineProps<
  T,
  K extends keyof T = keyof T,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  V extends T[K] extends [] ? T[K] : never = T[K],
> = {
  dataKey: K;
  idKey: keyof V[0];
  renderValueKey: keyof V[0];
  postfixContent?: React.ReactNode;
  variant?: Variant;
  sx?: SxProps<Theme>;
};

export function typographyMultiLineColumn<T, K extends keyof T = keyof T>({
  dataKey,
  idKey,
  renderValueKey,
  postfixContent = ',',
  sx = {},
  variant,
}: MultiLineProps<T, K>): ColumnShape<T> {
  return {
    key: String(dataKey) + String(renderValueKey),
    width: 295,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      const arr = rowData[dataKey] as unknown as T[K] extends [] ? T[K] : never;
      if (!Array.isArray(rowData[dataKey])) {
        return 'should be array type';
      }
      return (
        <Box display="flex" flexDirection="column">
          {arr.map((arrItem, index) => (
            <Typography variant={variant} sx={{ whiteSpace: 'normal', ...sx }} key={`${arrItem[idKey]}`}>
              {arrItem[renderValueKey]}
              {arr.length - 1 === index ? '' : postfixContent}
            </Typography>
          ))}
        </Box>
      );
    },
  };
}
