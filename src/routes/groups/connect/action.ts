import { connectGroupsFX, ConnectGroupsPayload } from '@core/groups';
import { LoaderFunctionArgs, redirect } from 'react-router-dom';

export const connectGroupsAction = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData) as unknown as ConnectGroupsPayload;

  if (!payload.userId) {
    return {
      error: 'You must select acc',
    };
  }

  try {
    await connectGroupsFX({
      groups: JSON.parse(payload.groups as unknown as string),
      userId: Number(payload.userId),
    });
  } catch (error) {
    return {
      error: 'Cannot connect group',
    };
  }

  return redirect('/groups');
};
