import { Box, BoxProps, Card, SxProps, Theme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';
import BaseTable, { AutoResizer, ColumnShape } from 'react-base-table';
import { NoRowsOverlay } from './NoRows';
import styles from './style.module.css';
import { ValidRowModel } from './types';

type Props<Row extends ValidRowModel> = {
  config: ColumnShape<Row>[];
  data: Row[];
  rowHeight?: number;

  cardSX?: SxProps<Theme>;
  cardId?: string;
  listHeader?: ReactNode;
  loadMore?: () => void;
};

export const BaseListBox = styled(Box)<BoxProps>(({ theme }) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    '& .BaseTable__table-main': {
      outline: 'none',
    },
    '& .BaseTable': {
      color: theme.palette.text.primary,
      background: theme.palette.background.paper,
    },
    '& .BaseTable__table': {
      color: theme.palette.text.primary,
      background: theme.palette.background.paper,
    },
    '& .BaseTable__header': {
      color: theme.palette.text.primary,
      background: theme.palette.background.paper,
    },
    '& .BaseTable__header-row': {
      color: theme.palette.text.primary,
      background: theme.palette.background.paper,
    },
    '& .BaseTable__header-row, .BaseTable__row': {
      borderBottom: `1px solid ${theme.palette.text.disabled}`,
      background: theme.palette.background.paper,
    },
    '& .BaseTable__table-frozen-right': {
      boxShadow: `-2px 0 4px 0 ${theme.palette.text.disabled}`,
    },
  };
});

export function BaseList<Row extends ValidRowModel>({
  config,
  data,
  rowHeight = 69,
  cardId,
  cardSX,
  listHeader,
  loadMore,
}: Props<Row>) {
  return (
    <Card sx={cardSX} id={cardId}>
      {listHeader}
      <BaseListBox>
        <AutoResizer className={styles.autoresizer}>
          {({ height, width }) => (
            <BaseTable
              width={width}
              height={height}
              fixed
              columns={config}
              data={data}
              emptyRenderer={() => <NoRowsOverlay />}
              rowHeight={rowHeight}
              onEndReachedThreshold={300}
              onEndReached={loadMore}
            />
          )}
        </AutoResizer>
      </BaseListBox>
    </Card>
  );
}
