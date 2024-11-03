import { VkGroupItem } from '@core/groups';
import { useDebounce } from '@core/hooks/useDebounce';
import { $replaceLinks, changeLinks } from '@core/replace-posts/store';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, TextField, Typography } from '@mui/material';
import { ActionModal } from '@ui/modal/ActionModal';
import { useUnit } from 'effector-react';
import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { extractIds } from './utils';
type Props = {
  setOpen: (v: boolean) => void;
  open: boolean;
};

export const ReplaceLinksModal = ({ open, setOpen }: Props) => {
  const navigate = useNavigate();

  return (
    <ActionModal
      loading={false}
      onClose={() => setOpen(false)}
      onConfirm={() => navigate('/posts-replace/create')}
      open={open}
      title="Укажите ссылки в формате vk.com/wall-227560578_24, каждая с новой строки"
      subtitle={<LinksForm />}
      confirmColor="primary"
    />
  );
};

const LinksForm = () => {
  const { links } = useUnit($replaceLinks);
  const [value, setValue] = useState('');
  const { groups } = useLoaderData() as { groups: VkGroupItem[] };

  const debouncedLinks = useDebounce(value, 2500);

  useEffect(() => {
    const linksToParse = new Set(debouncedLinks.split('\n').filter(Boolean));
    const linksToState: typeof links = [];
    for (const linkToParse of linksToParse) {
      const data = extractIds(linkToParse);
      linksToState.push({
        type: !data || !groups.some(g => g.groupId === Number(data.groupId)) ? 'invalid' : 'valid',
        value: linkToParse,
        groupId: Number(data?.groupId ?? 0),
        postId: data?.postId ?? '',
      });
    }

    changeLinks(linksToState);
  }, [debouncedLinks, groups]);

  return (
    <>
      <TextField
        margin="normal"
        multiline
        rows={8}
        fullWidth
        required
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <Box display="flex" gap={1} flexDirection="column">
        {links.map(vLink => (
          <Box key={vLink.value} display="flex" alignItems="center" gap={2}>
            <Typography>{vLink.value}</Typography>
            {vLink.type === 'valid' ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
          </Box>
        ))}
      </Box>
    </>
  );
};
