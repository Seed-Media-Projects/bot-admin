import { saveGroupPackFX, SaveGroupPackPayload } from '@core/group-packs';
import { LoaderFunctionArgs, redirect } from 'react-router-dom';

export const editGroupPackAction = async ({ request, params }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData) as unknown as SaveGroupPackPayload;
  const groupIds = JSON.parse(payload.groupIds as unknown as string);

  if (!groupIds.length) {
    return {
      error: 'Select at least one group',
    };
  }

  try {
    await saveGroupPackFX({
      groupIds: JSON.parse(payload.groupIds as unknown as string),
      name: payload.name,
      id: Number(params.id),
    });
  } catch (error) {
    return {
      error: 'Cannot update group pack',
    };
  }

  return redirect('/group-packs');
};
