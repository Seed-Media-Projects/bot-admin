import { searchWallRequestFX, VkWallSearch } from '@core/search-wall';
import { showSnack } from '@core/snacks/store';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { LoaderFunctionArgs } from 'react-router-dom';
dayjs.extend(utc);

export const adsAction = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  const params: VkWallSearch = {
    date: payload.date ? dayjs(payload.date.toString()).utc().format() : null,
    allGroups: payload.postTarget === 'toAllGroups',
    from: payload.from ? dayjs(payload.from.toString()).utc().format() : null,
    to: payload.to ? dayjs(payload.to.toString()).utc().format() : null,
    groupPackId: payload.groupPackId ? Number(payload.groupPackId) : null,
    groupId: payload.groupId ? Number(payload.groupId) : null,
    query: payload.query.toString(),
  };

  try {
    await searchWallRequestFX(params);
  } catch (error) {
    return {
      error: 'Cannot search',
    };
  }

  showSnack({
    id: Date.now().toString(),
    message: 'Запрос отправлен',
    severity: 'success',
  });

  return {
    success: true,
  };
};
