import {
  PluginTemplateTag,
  PluginTemplateTagAction,
  PluginTemplateTagContext,
} from '../../types/template';
import { loginUser, LoginUserResponse } from '../auth';
import * as store from '../store';

type RootActionArgs = [
  Username: store.InputStore['Username'],
  Password: store.InputStore['Password'],
  Region: store.InputStore['Region'],
  UserPoolId: store.InputStore['UserPoolId'],
  ClientId: store.InputStore['ClientId'],
  ReturnValue: 'accessToken' | 'idToken' | 'authId' | 'userId'
];
export const root: PluginTemplateTag['run'] = async (
  context: PluginTemplateTagContext,
  ...args: RootActionArgs
): Promise<LoginUserResponse[keyof LoginUserResponse]> => {
  const [Username, Password, Region, UserPoolId, ClientId, ReturnValue] = args;

  // Validate Inputs
  const inputs = { Username, Password, Region, UserPoolId, ClientId };
  for (const [key, val] of Object.entries(inputs)) {
    if (val === undefined || val === '') {
      return `${key} cannot be empty`;
    }
  }

  /**
   * Update Store Inputs
   *
   * Note: this will typically be redundant, but it's the only opportunity
   * to capture user input
   */
  await store.setInput(context.store, {
    Username,
    Password,
    Region,
    UserPoolId,
    ClientId,
  });

  // Restore cached auth
  const authStore = await store.getAuth(context.store);
  if (!authStore) {
    return 'No cached auth data found - please hit the "Authenticate" button';
  }

  return authStore.error ?? authStore[ReturnValue];
};

export const authenticate: PluginTemplateTagAction['run'] = async (
  context
): Promise<void> => {
  const inputStore = await store.getInput(context.store);
  if (!inputStore) {
    throw Error('Input credentials not found in cache');
  }
  const { Username, Password, Region, UserPoolId, ClientId } = inputStore;
  let authStore: store.AuthStore = {};
  try {
    const loginResponse = await loginUser(
      Username,
      Password,
      Region,
      UserPoolId,
      ClientId
    );
    authStore = loginResponse;
  } catch (error) {
    console.error(error);
    authStore.error =
      error instanceof Error
        ? error.message
        : 'Unknown authentication error occured';
  }
  await store.setAuth(context.store, authStore);
};

export const clearCache: PluginTemplateTagAction['run'] = async (
  context
): Promise<void> => {
  await store.clearAuth(context.store);
};
