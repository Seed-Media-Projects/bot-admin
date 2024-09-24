import { VkGroupItem } from '@core/groups';

export type GroupPackItem = {
  id: number;
  name: string;
  created: string;
  packItems: number[];
};

export type GroupPackDetail = {
  id: number;
  name: string;
  created: string;
  packItems: {
    id: string;
    vk_user_group_id: number;
    vk_group_pack_id: number;
    created: string;
    group: VkGroupItem;
  }[];
};

export type SaveGroupPackPayload = {
  groupIds: number[];
  name: string;
};
