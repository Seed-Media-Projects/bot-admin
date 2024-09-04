export type HealthInfo = {
  details: {
    'external-network': HealthItem;
    database: HealthItem;
  };
};

export type HealthItem = {
  status: HealthItemStatus;
  message?: string;
};
export type HealthItemStatus = 'up' | 'down';
