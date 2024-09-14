import { VkPostStatus } from '@core/posts';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadingIcon from '@mui/icons-material/Downloading';
import ErrorIcon from '@mui/icons-material/Error';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { AvaStatusBundle } from '@ui/table/config-elements/types';

export const postStatusBundle: Record<VkPostStatus, AvaStatusBundle> = {
  [VkPostStatus.Scheduled]: {
    color: 'info',
    icon: QueryBuilderIcon,
    tooltip: 'Scheduled',
  },
  [VkPostStatus.InProgress]: {
    color: 'primary',
    icon: DownloadingIcon,
    tooltip: 'In progress',
  },
  [VkPostStatus.Success]: {
    color: 'success',
    icon: CheckCircleIcon,
    tooltip: 'Success',
  },
  [VkPostStatus.Failed]: {
    color: 'error',
    icon: ErrorIcon,
    tooltip: 'Failed',
  },
};
