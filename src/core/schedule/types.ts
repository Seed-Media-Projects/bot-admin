export type ScheduleItem = {
  id: number;
  name: string;
  created: string;
  schedulePeriod: VkSchedulePeriod;
  scheduleData: VkScheduleData;
};

export type ScheduleDetail = {
  id: number;
  name: string;
  created: string;
  schedulePeriod: VkSchedulePeriod;
  scheduleData: VkScheduleData;
};

export type SaveSchedulePayload = {
  times: string[];
  name: string;
};

export enum VkSchedulePeriod {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

export type VkScheduleData = {
  times: string[];
};
