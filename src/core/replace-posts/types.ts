import { BaseFileInfo, FilePrivacyView, FileType } from '@core/files';
import { GroupPostStatusInfo, IntervalObj, IntervalTypes, PostFileDto, VkPostStatus } from '@core/posts';

export type VkReplacePostSettings = {
  carousel: boolean;
  firstComment: string;
  closedComments: boolean;
  linksPostStatus: Record<string, GroupPostStatusInfo>;
  status: VkPostStatus;
  allLinksText?: string;
  linksText?: Record<string, string>;
  links: string[];
};

export type VkReplacePostItem = {
  id: string;
  settings: VkReplacePostSettings;
  postInterval: IntervalObj | null;
  replaceInterval: IntervalObj | null;
  deleteInterval: IntervalObj | null;
  created: string;
  deleted: string | null;
};

export type VkReplacePostFile = {
  id: string;
  privacyView: FilePrivacyView | null;
  fileType: FileType;
  vk_post_pack_id: string;
  file_storage_id: number;
  file: BaseFileInfo;
  position: number;
};

export type VkReplacePostDetail = {
  id: string;
  settings: VkReplacePostSettings;
  postInterval: IntervalObj | null;
  replaceInterval: IntervalObj | null;
  deleteInterval: IntervalObj | null;
  created: string;
  deleted: string | null;
  files: VkReplacePostFile[];
};

export type ReplacePostSettingsDto = {
  carousel: boolean;
  sourceLink: string;
  firstComment: string;
  allLinksText?: string;
  linksText?: Record<string, string>;
  closedComments: boolean;
  links: string[];
};

export type ReplacePostIntervalsDto = {
  postIntervalType: IntervalTypes | null;
  postInterval: number | null;
  replaceIntervalType: IntervalTypes | null;
  replaceInterval: number | null;
  deleteIntervalType: IntervalTypes | null;
  deleteInterval: number | null;
};

export type CreateReplacePostDto = {
  settings: ReplacePostSettingsDto;
  intervals: ReplacePostIntervalsDto;
  fileIds: PostFileDto[];
};
