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
        displayName: 'username',
        type: 'string',
        validate: (arg) => (arg ? '' : 'Required'),
      },
      {
        displayName: 'password',
        type: 'string',
        validate: (arg) => (arg ? '' : 'Required'),
      },
      {
        displayName: 'region',
        type: 'string',
        validate: (arg) => (arg ? '' : 'Required'),
      },
      {
        displayName: 'userPoolId',
        type: 'string',
        validate: (arg) => (arg ? '' : 'Required'),
      },
      {
        displayName: 'clientId',
        type: 'string',
        validate: (arg) => (arg ? '' : 'Required'),
      },
      {
        displayName: 'Provider',
        type: 'enum',
        validate: (arg) => (arg ? '' : 'Required'),
        defaultValue: 'amplify',
        options: [
          {
            displayName: 'AWS Amplify',
            value: 'amplify',
          },
          {
            displayName: 'Cognito Identity Provider',
            value: 'cognito',
          },
        ],
      },
      {
        displayName: 'awsProfile',
        type: 'string',
        defaultValue: 'staging',
        help: 'Run "aws sso login --profile <name>" first, and use the same profile name here.',
        hide: (args) => {
          // Only show this field when provider is 'cognito'
          const providerArg = args[5];
          return providerArg?.value !== 'cognito';
        },
      },
      {
        displayName: 'returnValue',
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
          {
            displayName: 'JSON',
            value: 'json',
          },
        ],
      },
    ],
  },
];
