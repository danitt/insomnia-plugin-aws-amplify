import { IContext } from 'types';
import { loginUser, LoginUserResponse } from './auth';

// Cache Intervals
const ONE_HOUR_MS = 1000 * 60 * 60;
const EIGHT_HOURS_MS = ONE_HOUR_MS * 8;
const ONE_WEEK_MS = ONE_HOUR_MS * 24 * 7;
interface IStoreCache extends LoginUserResponse {
  time: number;
}
async function loginUserWithContext(
  context: IContext,
  Username: string,
  Password: string,
  Region: string,
  UserPoolId: string,
  ClientId: string,
  CacheInterval: string,
  ReturnValue: 'accessToken' | 'idToken' | 'authId' | 'userId',
): Promise<LoginUserResponse[keyof LoginUserResponse]> {
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
      {
        displayName: 'CacheExpiry',
        type: 'enum',
        validate: (arg: string) => arg ? '' : 'Required',
        defaultValue: ONE_HOUR_MS,
        options: [
          {
            displayName: 'No Caching',
            value: 1000,
          },
          {
            displayName: '1 Hour',
            value: ONE_HOUR_MS,
          },
          {
            displayName: '8 Hours',
            value: EIGHT_HOURS_MS,
          },
          {
            displayName: '1 Week',
            value: ONE_WEEK_MS,
          },
        ]
      },
      {
        displayName: 'ReturnValue',
        type: 'enum',
        validate: (arg: string) => arg ? '' : 'Required',
        defaultValue: 'accessToken',
        options: [
          {
            displayName: 'AccessToken',
            value: 'accessToken',
          },
          {
            displayName: 'IdToken',
            value: 'idToken',
          },
          {
            displayName: 'AuthId',
            value: 'authId',
          },
          {
            displayName: 'UserId',
            value: 'userId',
          },
        ]
      },
    ],
  },
];
