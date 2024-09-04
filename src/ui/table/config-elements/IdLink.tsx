import { Box, Link, Typography, useTheme } from '@mui/material';
import { ColumnShape } from 'react-base-table';

type Props<T extends { id: number | string }> = {
  viewIdKeys: (keyof T)[];
  link: (id: T['id']) => string;
  key: string;
};

function BoxLink({ viewId, href }: { viewId: React.ReactNode; href: string }) {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Link href={href}>
        <Typography
          noWrap
          variant="body2"
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.main,
            textDecoration: 'none',
            ':hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {viewId}
        </Typography>
      </Link>
    </Box>
  );
}

export function idLinkColumn<T extends { id: number | string }>({ viewIdKeys, link, key }: Props<T>): ColumnShape<T> {
  return {
    key,
    width: 150,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      const viewIdKey = viewIdKeys.find(v => !!rowData[v])!;
      const viewId = rowData[viewIdKey] as unknown as React.ReactNode;
      return <BoxLink viewId={viewId} href={link(rowData.id)} />;
    },
  };
}
