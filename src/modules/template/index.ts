import { PluginTemplateTag } from '../../types/template';
import * as actions from '../action';

export const rootTemplate: PluginTemplateTag[] = [
  {
    run: actions.root,
    name: 'AwsAmplifyAuth',
    displayName: 'AWS Amplify Auth',
    description: 'Insomnia plugin to authenticate via AWS Amplify',
    disablePreview: () => false,
    actions: [
      {
        name: 'Clear Cache',
        icon: 'fa fa-trash',
        run: actions.clearCache,
      },
      {
        name: 'Authenticate',
        icon: 'fa fa-lock',
        run: actions.authenticate,
      },
    ],
    args: [
      {
        displayName: 'Username',
        type: 'string',
        validate: (arg) => (arg ? '' : 'Required'),
      },
      {
        displayName: 'Password',
        type: 'string',
        validate: (arg) => (arg ? '' : 'Required'),
      },
      {
        displayName: 'Region',
        type: 'string',
        validate: (arg) => (arg ? '' : 'Required'),
      },
      {
        displayName: 'UserPoolId',
        type: 'string',
        validate: (arg) => (arg ? '' : 'Required'),
      },
      {
        displayName: 'ClientId',
        type: 'string',
        validate: (arg) => (arg ? '' : 'Required'),
      },
      {
        displayName: 'ReturnValue',
        type: 'enum',
        validate: (arg) => (arg ? '' : 'Required'),
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
        ],
      },
    ],
  },
];
