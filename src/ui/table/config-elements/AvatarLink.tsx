import { Avatar, Box, Link, Typography, styled } from '@mui/material';
import { ColumnShape } from 'react-base-table';
import { BaseUserInfo } from '../../../core/users';
import { getDiceBearAvatar } from '../../../core/utils/dicebear';
import { getInitials } from '../../../core/utils/get-initials';

type Props = {
  link: (id: number) => string;
};

export function avatarNameLinkColumn<T extends BaseUserInfo>({ link }: Props): ColumnShape<T> {
  return {
    key: 'user',
    width: 260,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      return <AvatarRow user={rowData} link={link} />;
    },
  };
}
export function avatarNameLinkColumnToKey<T>(dataKey: keyof T, { link }: Props): ColumnShape<T> {
  return {
    key: String(dataKey),
    width: 230,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      const user = rowData[dataKey] as unknown as BaseUserInfo;

      if (!user) return null;

      return <AvatarRow user={user} link={link} />;
    },
  };
}

type RowProps = Props & {
  user: BaseUserInfo;
};

const sx = {
  fontWeight: 600,
  color: 'text.primary',
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline',
  },
};

export const AvatarWithoutImageLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  marginRight: theme.spacing(3),
}));

export const AvatarRow = ({ user, link }: RowProps) => {
  const { id, firstName, lastName, photoUrl, username } = user;
  const url = !photoUrl
    ? null
    : photoUrl.includes('ducky')
      ? `${import.meta.env.VITE_SERVER_URL}${photoUrl}`
      : `${import.meta.env.VITE_SERVER_URL_PRICEME}${photoUrl}`;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <AvatarWithoutImageLink href={link(id)}>
        <Avatar
          sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}
          src={url || getDiceBearAvatar(`${firstName}-${lastName}`)}
        >
          {url ? null : getInitials(`${firstName} ${lastName}`)}
        </Avatar>
      </AvatarWithoutImageLink>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
        <Link href={link(id)}>
          <Typography noWrap variant="body2" sx={sx}>
            {firstName} {lastName}
          </Typography>
        </Link>
        <Typography noWrap variant="caption" sx={{ textDecoration: 'none' }}>
          {username}
        </Typography>
      </Box>
    </Box>
  );
};
