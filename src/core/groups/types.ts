export type AvailableGroupItem = VkGroupAdditionalInfo & {
  id: number;
  name: string;
  photo_100: string;
  screen_name: string;
  type: 'page';
};

export type VkGroupAdditionalInfo = {
  /**
    • 1 — модератор;
    • 2 — редактор;
    • 3 — администратор.
  */
  admin_level: 3 | 2 | 1;
  can_post: 1 | 0;
  can_see_all_posts: 1 | 0;
  can_upload_doc: 1 | 0;
  can_upload_story: 1 | 0;
  can_upload_video: 1 | 0;
  is_admin: 1 | 0;
  is_advertiser: 1 | 0;
  is_closed: 1 | 0;
  is_member: 1 | 0;
};

export type VkGroupItem = {
  id: number;
  vkUserId: string;
  groupId: number;
  name: string;
  photo: string;
  additionalInfo: VkGroupAdditionalInfo;
  created: string;
};

export type ConnectGroupsPayload = { groups: AvailableGroupItem[]; userId: number };
