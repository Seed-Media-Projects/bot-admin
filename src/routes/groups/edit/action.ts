import { updateGroupFX } from '@core/groups';
import { LoaderFunctionArgs, redirect } from 'react-router-dom';

export const updateGroupAction = async ({ request, params }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  if (!payload.userId) {
    return {
      error: 'You must select acc',
    };
  }

  try {
    await updateGroupFX({
      groupId: Number(params.id),
      userId: Number(payload.userId),
    });
  } catch (error) {
    return {
      error: 'Cannot update group',
    };
  }

  return redirect('/groups');
};
