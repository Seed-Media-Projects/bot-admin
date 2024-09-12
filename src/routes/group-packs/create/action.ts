import { createGroupPackFX, SaveGroupPackPayload } from '@core/group-packs';
import { LoaderFunctionArgs, redirect } from 'react-router-dom';

export const createGroupPackAction = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData) as unknown as SaveGroupPackPayload;
  const groupIds = JSON.parse(payload.groupIds as unknown as string);

  if (!groupIds.length) {
    return {
      error: 'Select at least one group',
    };
  }

  try {
    await createGroupPackFX({
      groupIds: JSON.parse(payload.groupIds as unknown as string),
      name: payload.name,
    });
  } catch (error) {
    return {
      error: 'Cannot create group pack',
    };
  }

  return redirect('/group-packs');
};
