export type InputStore = {
  username: string;
  password: string;
  region: string;
  userPoolId: string;
  clientId: string;
  provider: 'amplify' | 'cognito';
};

export type AuthStore = {
  pools: UserPoolCredentials[];
};

export type UserPoolCredentials = {
  userPoolId: string;
  authId: string;
  userId: string;
  idToken: string;
  accessToken: string;
  expiresAt: number /** unix timestamp in ms */;
};

export type ErrorStore = {
  message: string | undefined;
};

export type RootStore = {
  input: InputStore;
  auth: AuthStore;
  error: ErrorStore;
};
