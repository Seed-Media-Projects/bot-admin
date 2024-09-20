import { FileInfo } from '@core/files';
import { IntervalTypes } from '@core/posts';
import { CreateStoryDto, createStoryPackFX } from '@core/stories';
import { objKeys } from '@core/utils/mappings';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { LoaderFunctionArgs, redirect } from 'react-router-dom';
dayjs.extend(utc);

export const createStoryPackAction = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  const groupsText = objKeys(payload).reduce<Record<number, string>>((acc, next) => {
    const nextKey = next.toString();
    if (nextKey.startsWith('groupsText_')) {
      const [, id] = nextKey.split('_');
      acc[Number(id)] = payload[nextKey].toString();
    }
    return acc;
  }, {});

  const storyFile = JSON.parse(payload.file?.toString() ?? '') as FileInfo;

  if (!storyFile) {
    return {
      error: 'Нет файла для поста',
    };
  }

  const requestData: CreateStoryDto = {
    toAllGroups: payload.postTarget === 'toAllGroups',
    settings: {
      allGroupsText: payload.allGroupsText?.toString() ?? undefined,
      groupsText: objKeys(groupsText).length ? groupsText : undefined,
    },
    postInterval: payload.postInterval ? Number(payload.postInterval) : null,
    postIntervalType: payload.postIntervalType as IntervalTypes,
    postDate: payload.postDate ? dayjs(payload.postDate.toString()).utc().format() : null,
    groupPackId: payload.groupPackId ? Number(payload.groupPackId) : null,
    groupId: payload.groupId ? Number(payload.groupId) : null,
    file: {
      fileId: storyFile.id,
      fileType: storyFile.fileType,
    },
  };

  if (!requestData.toAllGroups && !requestData.groupId && !requestData.groupPackId) {
    return {
      error: 'Не выбрано куда постить',
    };
  }

  try {
    await createStoryPackFX(requestData);
  } catch (error) {
    console.error(error);
    return {
      error: 'Не удалось создать стори',
    };
  }

  return redirect('/stories');
};
