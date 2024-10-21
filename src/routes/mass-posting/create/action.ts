import { CreateMassPostingDto, createMassPostingFX, CreateMassPostingItem } from '@core/mass-posting';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { LoaderFunctionArgs, redirect } from 'react-router-dom';
dayjs.extend(utc);

export const createMassPostingAction = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  const requestData: CreateMassPostingDto = {
    toAllGroups: payload.postTarget === 'toAllGroups',
    groupPackId: payload.groupPackId ? Number(payload.groupPackId) : null,
    groupId: payload.groupId ? Number(payload.groupId) : null,
    items: (JSON.parse(payload.items.toString()) as CreateMassPostingItem[]).map((i, index) => ({
      ...i,
      position: index + 1,
    })),
  };

  if (!requestData.toAllGroups && !requestData.groupId && !requestData.groupPackId) {
    return {
      error: 'Не выбрано куда постить',
    };
  }

  try {
    await createMassPostingFX(requestData);
  } catch (error) {
    console.error(error);
    return {
      error: 'Не удалось создать ',
    };
  }

  return redirect('/mass-posting');
};
