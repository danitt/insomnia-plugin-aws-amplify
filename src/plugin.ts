import { IContext } from 'types';
import { loginUser } from './auth';

/**
 * Load JWT from store if exists
 */
async function loginUserWithContext(context: IContext, ...params: Parameters<typeof loginUser>): ReturnType<typeof loginUser> {
  const storeKey = params.join(';');
  const storedUserDataStr = await context.store.getItem(storeKey);
  if (storedUserDataStr) {
    const storedUserData = JSON.parse(storedUserDataStr);
    return storedUserData;
  }
  const result = await loginUser(...params);
  await context.store.setItem(storeKey, JSON.stringify(result));

  return result;
}

export const templateTags = [
  {
    run: loginUserWithContext,
    name: 'AwsAmplifyAuth',
    displayName: 'AWS Amplify Auth',
    description: 'Insomnia plugin to authenticate via AWS Amplify',
    args: [
      {
        displayName: 'Username',
        type: 'string',
        validate: (arg: string) => arg ? '' : 'Required',
      },
      {
        displayName: 'Password',
        type: 'string',
        validate: (arg: string) => arg ? '' : 'Required',
      },
      {
        displayName: 'Region',
        type: 'string',
        validate: (arg: string) => arg ? '' : 'Required',
      },
      {
        displayName: 'UserPoolId',
        type: 'string',
        validate: (arg: string) => arg ? '' : 'Required',
      },
      {
        displayName: 'ClientId',
        type: 'string',
        validate: (arg: string) => arg ? '' : 'Required',
      },
    ],
  },
];
