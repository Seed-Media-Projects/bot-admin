import { FileInfo } from '@core/files';
import { IntervalTypes } from '@core/posts';
import { CreateReplacePostDto, createReplacePostFX } from '@core/replace-posts';
import { objKeys } from '@core/utils/mappings';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { LoaderFunctionArgs, redirect } from 'react-router-dom';
dayjs.extend(utc);

export const createPostReplaceAction = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  const linksText = objKeys(payload).reduce<Record<string, string>>((acc, next) => {
    const nextKey = next.toString();
    if (nextKey.startsWith('linksText_')) {
      const [, groupId, postId] = nextKey.split('_');
      acc[`${groupId}_${postId}`] = payload[nextKey].toString();
    }
    return acc;
  }, {});

  const requestData: CreateReplacePostDto = {
    settings: {
      carousel: !!payload.carousel,
      closedComments: !!payload.closedComments,
      firstComment: payload.firstComment?.toString() ?? '',
      sourceLink: '',
      allLinksText: payload.allLinksText?.toString() ?? undefined,
      linksText: objKeys(linksText).length ? linksText : undefined,
      links: JSON.parse(payload.links.toString()) as string[],
    },
    intervals: {
      deleteInterval: payload.deleteInterval ? Number(payload.deleteInterval) : null,
      deleteIntervalType: payload.deleteIntervalType as IntervalTypes,
      postInterval: payload.postInterval ? Number(payload.postInterval) : null,
      postIntervalType: payload.postIntervalType as IntervalTypes,
      replaceInterval: payload.replaceInterval ? Number(payload.replaceInterval) : null,
      replaceIntervalType: payload.replaceIntervalType as IntervalTypes,
    },
    fileIds: (JSON.parse(payload.postFiles.toString()) as FileInfo[]).map((f, index) => ({
      fileId: f.id,
      fileType: f.fileType,
      privacyView: null,
      position: index + 1,
    })),
  };

  if (!requestData.settings.links.length) {
    return {
      error: 'Не выбраны ссылки для замены постов',
    };
  }

  try {
    await createReplacePostFX(requestData);
  } catch (error) {
    console.error(error);
    return {
      error: 'Не удалось создать замену постов',
    };
  }

  return redirect('/posts-replace');
};
