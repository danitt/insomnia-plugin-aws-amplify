import {
  PluginTemplateTag,
  PluginTemplateTagAction,
  PluginTemplateTagContext,
} from '../../types/template';
import { loginUser, LoginUserResponse } from '../auth';
import * as store from '../store';

type ReturnValue = 'accessToken' | 'idToken' | 'authId' | 'userId';
type RootActionArgs = [
  username: string,
  password: string,
  region: string,
  userPoolId: string,
  clientId: string,
  ReturnValue,
];

export const root: PluginTemplateTag['run'] = async (
  context: PluginTemplateTagContext,
  ...args: RootActionArgs
): Promise<LoginUserResponse[keyof LoginUserResponse]> => {
  const [username, password, region, userPoolId, clientId, returnValue] = args;

  // Validate Inputs
  const inputs = { username, password, region, userPoolId, clientId };
  for (const [key, val] of Object.entries(inputs)) {
    if (!val) {
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
    username,
    password,
    region,
    userPoolId,
    clientId,
  });

  // Restore cached auth
  const authStorePool = await store.getAuthPool(context.store, userPoolId);
  if (!authStorePool) {
    return 'No cached auth data found - please hit the "Authenticate" button';
  }

  // Validate expired auth
  const nowMs = new Date().getTime();
  const expiresAt = authStorePool.expiresAt ?? 0;
  if (expiresAt < nowMs) {
    console.info('Auth token expired, re-authenticating');
    await authenticate(context);
  }

  const error = await store.getError(context.store);

  return error.message ?? authStorePool[returnValue];
};

export const authenticate: PluginTemplateTagAction['run'] = async (
  context,
): Promise<void> => {
  const inputStore = await store.getInput(context.store);
  if (!inputStore) {
    throw Error('Input credentials not found in cache');
  }
  const { username, password, region, userPoolId, clientId } = inputStore;
  try {
    const loginResponse = await loginUser(
      username,
      password,
      region,
      userPoolId,
      clientId,
    );

    // hardcoded token expiry - can make configurable in future if needed
    const ONE_HOUR_MS = 1000 * 60 * 60;
    const expiresAt = new Date().getTime() + ONE_HOUR_MS;
    await store.setAuthPool(context.store, {
      ...loginResponse,
      userPoolId,
      expiresAt,
    });
    await store.clearError(context.store);
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown authentication error occured';
    await store.setError(context.store, {
      message,
    });
    await store.clearAuthPool(context.store, userPoolId);
  }
};

export const clearCache: PluginTemplateTagAction['run'] = async (
  context,
): Promise<void> => {
  const inputStore = await store.getInput(context.store);
  if (!inputStore) {
    throw Error('Input credentials not found in cache');
  }
  await store.clearAuthPool(context.store, inputStore.userPoolId);
};
