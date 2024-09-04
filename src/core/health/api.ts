import { AXPOSTER } from '@core/data/fetcher';
import { AxiosError } from 'axios';
import { createEffect } from 'effector';
import { HealthInfo } from './types';

export const getHealthFX = createEffect(async () => {
  try {
    const { data } = await AXPOSTER.get<HealthInfo>('/api/health');

    return data;
  } catch (error) {
    const axErr = error as AxiosError;

    return axErr.response?.data as HealthInfo;
  }
});
