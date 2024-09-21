import { BaseFileInfo } from '@core/files';
import { GroupPackDetail } from '@core/group-packs';
import { VkGroupItem } from '@core/groups';
import { IntervalObj, IntervalTypes, VkPostStatus } from '@core/posts';

export type VkStorySettings = {
  groupStoryStatus: Record<number, GroupStoryStatusInfo>;
  status: VkPostStatus;
  allGroupsText?: string;
  groupsText?: Record<number, string>;
  allGroupsLink?: string;
  groupsLink?: Record<number, string>;
};

export type GroupStoryStatusInfo = {
  status: VkPostStatus;
  storyId?: number;
  error?: string;
};

export type VkStoryPackItem = {
  id: string;
  toAllGroups: boolean;
  settings: VkStorySettings;
  postInterval: IntervalObj | null;
  postDate: string | null;
  replaceInterval: IntervalObj | null;
  deleteInterval: IntervalObj | null;
  created: string;
  deleted: string | null;
  vk_group_pack_id: number | null;
  vk_user_group_id: number | null;
  fileType: 'img' | 'video';
};

export type VkStoryPackDetail = {
  id: string;
  toAllGroups: boolean;
  settings: VkStorySettings;
  postInterval: IntervalObj | null;
  postDate: string | null;
  created: string;
  deleted: string | null;
  groupPack: GroupPackDetail | null;
  group: VkGroupItem | null;
  file: BaseFileInfo;
  fileType: 'img' | 'video';
};

export type StorySettingsDto = {
  allGroupsText?: string;
  groupsText?: Record<number, string>;
  allGroupsLink?: string;
  groupsLink?: Record<number, string>;
};

export type StoryFileDto = {
  fileId: number;
  fileType: 'img' | 'video';
};

export type CreateStoryDto = {
  toAllGroups: boolean;
  settings: StorySettingsDto;
  postIntervalType: IntervalTypes | null;
  postInterval: number | null;
  postDate: string | null;
  groupPackId: number | null;
  groupId: number | null;
  file: StoryFileDto;
};
