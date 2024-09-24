import { IntervalTypes, VkPostStatus } from '@core/posts';
import { objKeys } from '@core/utils/mappings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
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
  [VkPostStatus.Stopped]: {
    color: 'warning',
    icon: DoNotDisturbIcon,
    tooltip: 'Stopped',
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

export const privacyViewOptions = [
  {
    title: 'Все',
    value: 'all',
  },
  {
    title: 'Участники',
    value: 'members',
  },
];
export const postTargetOptions = [
  {
    title: 'Во все группы',
    value: 'toAllGroups',
  },
  {
    title: 'В пак групп',
    value: 'groupPacks',
  },
  {
    title: 'В группу',
    value: 'group',
  },
];

export const intervalTypeOptions = objKeys(IntervalTypes).map(it => ({
  title: it,
  value: IntervalTypes[it],
}));
