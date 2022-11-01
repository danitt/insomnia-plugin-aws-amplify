import { PluginTemplateTag, PluginTemplateTagContext } from '../../types/template';
import { loginUser, LoginUserResponse } from '../auth';

// Cache Intervals
interface IStoreCache extends LoginUserResponse {
  time: number;
}
export const rootAction: PluginTemplateTag['run'] = async (
  context: PluginTemplateTagContext,
  Username: string,
  Password: string,
  Region: string,
  UserPoolId: string,
  ClientId: string,
  CacheInterval: string,
  ReturnValue: 'accessToken' | 'idToken' | 'authId' | 'userId',
): Promise<LoginUserResponse[keyof LoginUserResponse]> => {
  const nowMs = new Date().getTime();
  const cacheIntervalMs = Number(CacheInterval);

  // Validate Inputs
  const inputs = { Username, Password, Region, UserPoolId, ClientId };
  for (const [key, val] of Object.entries(inputs)) {
    if (val === undefined || val === '') {
      throw Error(`${key} cannot be empty`);
    }
  };

  // Restore cached auth
  const storeKey = [Username, Password, Region, UserPoolId, ClientId].join(';');
  const cacheDataStr = await context.store.getItem(storeKey);
  if (cacheDataStr) {
    const { time, ...loginResponse }: IStoreCache = JSON.parse(cacheDataStr);
    const isValid = (time + cacheIntervalMs) >= nowMs;
   if (isValid) {
     console.info('Restoring from cache', { time, cacheIntervalMs, nowMs, loginResponse });
     return loginResponse[ReturnValue];
   }
  }

  // Throttle Queries
  const lastQueryTime = Number(await context.store.getItem('lastQueryTime'));
  if (lastQueryTime && (lastQueryTime + 1000) > nowMs) {
    throw Error('Auth queries /sec exceeded');
  }
  await context.store.setItem('lastQueryTime', String(nowMs));

  // Request Auth
  const loginResponse = await loginUser(Username, Password, Region, UserPoolId, ClientId);
  const cacheData: IStoreCache = {
    time: nowMs,
    ...loginResponse
  }
  await context.store.setItem(storeKey, JSON.stringify(cacheData));
  return loginResponse[ReturnValue];
}
