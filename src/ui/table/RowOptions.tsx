import { Link, SxProps, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { ColumnShape } from 'react-base-table';
import { MIconType } from './config-elements/types';

export type RowOption = {
  name: string;
  link: string;
  icon: MIconType;
  sx?: SxProps;
  disabled?: boolean;
};

type Props = {
  options: RowOption[];
  deleteBtn?: React.ReactNode;
};

export function actionsConfig<T>(): ColumnShape<T> {
  return {
    flexGrow: 0.1,
    width: 100,
    sortable: false,
    key: 'actions',
    title: 'Actions',
    frozen: 'right',
  };
}

export const RowOptionsIcons = ({ options, deleteBtn }: Props) => {
  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
      {options.map((option, index) => {
        const Icon = option.icon;
        return (
          <Link href={option.link} key={index} style={{ pointerEvents: option.disabled ? 'none' : undefined }}>
            <IconButton sx={option.sx} disabled={option.disabled}>
              <Tooltip title={option.name}>
                <Icon fontSize="small" />
              </Tooltip>
            </IconButton>
          </Link>
        );
      })}
      {deleteBtn}
    </Box>
  );
};
