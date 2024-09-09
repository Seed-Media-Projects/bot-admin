import { VkTokenStatus } from '@core/accounts';
import { Check, Close } from '@mui/icons-material';
import { AvaStatusBundle } from '@ui/table/config-elements/types';

export const accountsStatusBundle: Record<VkTokenStatus, AvaStatusBundle> = {
  [VkTokenStatus.Active]: {
    color: 'success',
    icon: Check,
    tooltip: 'Active',
  },
  [VkTokenStatus.Inactive]: {
    color: 'warning',
    icon: Close,
    tooltip: 'Inactive',
  },
};
