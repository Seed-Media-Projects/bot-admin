import { BaseFileInfo } from '@core/files';
import { GroupPackDetail } from '@core/group-packs';
import { VkGroupItem } from '@core/groups';

export type VkPostSettings = {
  carousel: boolean;
  sourceLink: string;
  firstComment: string;
  closedComments: boolean;
  groupPostStatus: Record<number, GroupPostStatusInfo>;
  status: VkPostStatus;
  allGroupsText?: string;
  groupsText?: Record<number, string>;
};
export enum VkPostStatus {
  Scheduled = 'scheduled',
  InProgress = 'in_progess',
  Success = 'success',
  Failed = 'failed',
}

export type GroupPostStatusInfo = {
  status: VkPostStatus;
  postId?: number;
  commentId?: number;
  error?: string;
};

export type IntervalObj = { months: number; days: number; hours: number; minutes: number; seconds: number };

export enum IntervalTypes {
  Hours = 'hours',
  Minutes = 'minutes',
  Seconds = 'seconds',
}

export type VkPostPackItem = {
  id: string;
  toAllGroups: boolean;
  settings: VkPostSettings;
  postInterval: IntervalObj | null;
  postDate: string | null;
  replaceInterval: IntervalObj | null;
  deleteInterval: IntervalObj | null;
  created: string;
  deleted: string | null;
  vk_group_pack_id: number | null;
  vk_user_group_id: number | null;
};

export type VkPostFile = {
  id: string;
  privacyView: 'all' | 'members' | null;
  fileType: 'img' | 'video';
  vk_post_pack_id: string;
  file_storage_id: number;
  file: BaseFileInfo;
};

export type VkPostPackDetail = {
  id: string;
  toAllGroups: boolean;
  settings: VkPostSettings;
  postInterval: IntervalObj | null;
  postDate: string | null;
  replaceInterval: IntervalObj | null;
  deleteInterval: IntervalObj | null;
  created: string;
  deleted: string | null;
  groupPack: GroupPackDetail | null;
  group: VkGroupItem | null;
  files: VkPostFile[];
};

export type VkPostPackDetailResponse = {
  post: VkPostPackDetail;
  replacementPost: VkPostPackDetail | null;
};

export type PostSettingsDto = {
  carousel: boolean;
  sourceLink: string;
  firstComment: string;
  allGroupsText?: string;
  groupsText?: Record<number, string>;
  closedComments: boolean;
};

export type PostIntervalsDto = {
  postIntervalType: IntervalTypes | null;
  postInterval: number | null;

  replaceIntervalType: IntervalTypes | null;
  replaceInterval: number | null;

  deleteIntervalType: IntervalTypes | null;
  deleteInterval: number | null;
};

export type PostFileDto = {
  fileId: number;
  fileType: 'img' | 'video';
  privacyView: 'all' | 'members' | null;
};

export type CreatePostDto = {
  toAllGroups: boolean;
  settings: PostSettingsDto;
  intervals: PostIntervalsDto;
  postDate: string | null;
  groupPackId: number | null;
  groupId: number | null;
  fileIds: PostFileDto[];
  replaceItemPost: CreatePostDto | null;
};
