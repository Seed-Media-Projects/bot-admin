export type AccountItem = {
  id: number;
  vkInfo?: VkInfo;
  vkUserId: string;
  tokenStatus: VkTokenStatus;
  created: string;
  deviceId: string;
  updated: string;
};
export type VkInfo = {
  userId: string;
  avatar: string;
  name: string;
  firstName: string;
  lastName: string;
  sex: number;
};

export enum VkTokenStatus {
  Active = 'active',
  Inactive = 'inactive',
}
