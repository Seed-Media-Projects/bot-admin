import { BaseFileInfo, FilePrivacyView, FileType } from '@core/files';
import { GroupPackDetail } from '@core/group-packs';
import { VkGroupItem } from '@core/groups';
import { GroupPostStatusInfo, VkPostStatus } from '@core/posts';

export type VkMassPostingItemSettings = {
  groupPostStatus: Record<number, GroupPostStatusInfo>;
  status: VkPostStatus;
  groupsText: string;
};

export type VkMassPosting = {
  id: string;
  toAllGroups: boolean;
  vk_group_pack_id: number | null;
  vk_user_group_id: number | null;
  created: string;
  deleted: string | null;
};

export type VkMassPostingItemFile = {
  id: string;
  vk_mass_posting_item_id: string;
  file_storage_id: number;
  position: number;
  privacyView: FilePrivacyView;
  fileType: FileType;
  fileName: string | null;
  file: BaseFileInfo;
};

export type VkMassPostingItem = {
  id: string;
  vk_mass_posting_id: string;
  settings: VkMassPostingItemSettings;
  postDate: string;
  position: number;
  files: VkMassPostingItemFile[];
};

export type VkMassPostingDetail = VkMassPosting & {
  groupPack: GroupPackDetail | null;
  group: VkGroupItem | null;
  items: VkMassPostingItem[];
};

export type CreateMassPostingItem = {
  groupsText?: string;
  position: number;
  postDate: string;
  files: {
    fileId: number;
    fileUrl: string;
    fileType: FileType;
    fileName?: string;
    privacyView: FilePrivacyView;
    position: number;
  }[];
};

export type CreateMassPostingDto = {
  toAllGroups: boolean;
  groupPackId: number | null;
  groupId: number | null;
  items: CreateMassPostingItem[];
};
