import { FileInfo } from '@core/files';
import { CreatePostDto, createPostPackFX, IntervalTypes } from '@core/posts';
import { objKeys } from '@core/utils/mappings';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { LoaderFunctionArgs, redirect } from 'react-router-dom';
dayjs.extend(utc);

export const createPostPackAction = async ({ request }: LoaderFunctionArgs) => {
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

  const replacementGroupsText = objKeys(payload).reduce<Record<number, string>>((acc, next) => {
    const nextKey = next.toString();
    if (nextKey.startsWith('replaceItemPost.groupsText_')) {
      const [, id] = nextKey.split('_');
      acc[Number(id)] = payload[nextKey].toString();
    }
    return acc;
  }, {});

  const requestData: CreatePostDto = {
    toAllGroups: payload.postTarget === 'toAllGroups',
    settings: {
      carousel: !!payload.carousel,
      closedComments: !!payload.closedComments,
      firstComment: payload.firstComment?.toString() ?? '',
      sourceLink: payload.sourceLink?.toString() ?? '',
      allGroupsText: payload.allGroupsText?.toString() ?? undefined,
      groupsText: objKeys(groupsText).length ? groupsText : undefined,
    },
    intervals: {
      deleteInterval: payload.deleteInterval ? Number(payload.deleteInterval) : null,
      deleteIntervalType: payload.deleteIntervalType as IntervalTypes,
      postInterval: payload.postInterval ? Number(payload.postInterval) : null,
      postIntervalType: payload.postIntervalType as IntervalTypes,
      replaceInterval: payload.replaceInterval ? Number(payload.replaceInterval) : null,
      replaceIntervalType: payload.replaceIntervalType as IntervalTypes,
    },
    postDate: payload.postDate ? dayjs(payload.postDate.toString()).utc().format() : null,
    groupPackId: payload.groupPackId ? Number(payload.groupPackId) : null,
    groupId: payload.groupId ? Number(payload.groupId) : null,
    fileIds: (JSON.parse(payload.postFiles.toString()) as FileInfo[]).map((f, index) => ({
      fileId: f.id,
      fileType: f.fileType,
      privacyView: null,
      position: index + 1,
    })),
    replaceItemPost: payload.replaceInterval
      ? {
          toAllGroups: false,
          settings: {
            carousel: !!payload['replaceItemPost.carousel'],
            closedComments: !!payload['replaceItemPost.closedComments'],
            firstComment: payload['replaceItemPost.firstComment']?.toString() ?? '',
            sourceLink: payload['replaceItemPost.sourceLink']?.toString() ?? '',
            allGroupsText: payload['replaceItemPost.allGroupsText']?.toString() ?? undefined,
            groupsText: objKeys(replacementGroupsText).length ? replacementGroupsText : undefined,
          },
          intervals: {
            deleteInterval: null,
            deleteIntervalType: null,
            postInterval: null,
            postIntervalType: null,
            replaceInterval: null,
            replaceIntervalType: null,
          },
          postDate: null,
          groupPackId: payload.groupPackId ? Number(payload.groupPackId) : null,
          groupId: payload.groupId ? Number(payload.groupId) : null,
          fileIds: (JSON.parse(payload['replaceItemPost.postFiles'].toString()) as FileInfo[]).map((f, index) => ({
            fileId: f.id,
            fileType: f.fileType,
            privacyView: null,
            position: index + 1,
          })),
          replaceItemPost: null,
        }
      : null,
  };

  if (!requestData.toAllGroups && !requestData.groupId && !requestData.groupPackId) {
    return {
      error: 'Не выбрано куда постить',
    };
  }

  try {
    await createPostPackFX(requestData);
  } catch (error) {
    console.error(error);
    return {
      error: 'Не удалось создать пост пак',
    };
  }

  return redirect('/posts');
};
