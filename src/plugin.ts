import { IContext } from 'types';
import { loginUser } from './auth';

// Cache Intervals
const ONE_HOUR_MS = 1000 * 60 * 60;
const EIGHT_HOURS_MS = ONE_HOUR_MS * 8;
const ONE_WEEK_MS = ONE_HOUR_MS * 24 * 7;

interface IStoreCache {
  time: number;
  accessToken: string;
}
type LoginUserWithContextParams = [...Parameters<typeof loginUser>, number];
async function loginUserWithContext(context: IContext, ...params: LoginUserWithContextParams): Promise<string> {
  const cacheExpiry = Number(params.slice(-1)) ?? ONE_HOUR_MS;
  const loginParams = params.slice(0, -1) as Parameters<typeof loginUser>;
  const storeKey = loginParams.join(';');
  const cacheDataStr = await context.store.getItem(storeKey);
  if (cacheDataStr) {
    const { time, accessToken }: IStoreCache = JSON.parse(cacheDataStr);
    const isValid = (time + cacheExpiry) >= new Date().getTime();
   if (isValid) {
     return accessToken;
   }
  }

  const { accessToken } = await loginUser(...loginParams);
  const cacheData: IStoreCache = {
    time: new Date().getTime(),
    accessToken,
  }
  await context.store.setItem(storeKey, JSON.stringify(cacheData));
  return accessToken;
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
    ],
  },
];
