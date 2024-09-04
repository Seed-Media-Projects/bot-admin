import { getHealthFX } from '@core/health';

export const homeLoader = async () => {
  const [{ details: detailsDuck }] = await Promise.all([getHealthFX()]);
  return { detailsDuck };
};
