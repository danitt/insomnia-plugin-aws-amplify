import { rootAction } from '../action';
import { PluginTemplateTag } from '../../types/template';

const ONE_HOUR_MS = 1000 * 60 * 60;
const EIGHT_HOURS_MS = ONE_HOUR_MS * 8;
const ONE_WEEK_MS = ONE_HOUR_MS * 24 * 7;

export const rootTemplate: PluginTemplateTag[] = [
  {
    run: rootAction,
    name: 'AwsAmplifyAuth',
    displayName: 'AWS Amplify Auth',
    description: 'Insomnia plugin to authenticate via AWS Amplify',
    disablePreview: (args) => {
      /* ensure all fields are filled in before attempting to query */
      return args.every(a => !!a.value);
    },
    actions: [],
    args: [
      {
        displayName: 'Username',
        type: 'string',
        validate: (arg) => arg ? '' : 'Required',
      },
      {
        displayName: 'Password',
        type: 'string',
        validate: (arg) => arg ? '' : 'Required',
      },
      {
        displayName: 'Region',
        type: 'string',
        validate: (arg) => arg ? '' : 'Required',
      },
      {
        displayName: 'UserPoolId',
        type: 'string',
        validate: (arg) => arg ? '' : 'Required',
      },
      {
        displayName: 'ClientId',
        type: 'string',
        validate: (arg) => arg ? '' : 'Required',
      },
      {
        displayName: 'CacheExpiry',
        type: 'enum',
        validate: (arg) => arg ? '' : 'Required',
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
        validate: (arg) => arg ? '' : 'Required',
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
