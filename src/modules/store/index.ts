import { PluginStore } from '../../types/template';

const AUTH_STORE_KEY = 'aws-amplify-auth';
const INPUT_STORE_KEY = 'aws-amplify-input';

export type InputStore = {
  Username: string;
  Password: string;
  Region: string;
  UserPoolId: string;
  ClientId: string;
};

export type AuthStore = {
  authId?: string;
  userId?: string;
  idToken?: string;
  accessToken?: string;
  error?: string;
  expiresAt?: number /** unix timestamp in ms */;
};

export async function getInput(
  store: PluginStore
): Promise<InputStore | undefined> {
  const str = await store.getItem(INPUT_STORE_KEY);
  if (!str) {
    return undefined;
  }
  return JSON.parse(str) as InputStore;
}

export async function getAuth(
  store: PluginStore
): Promise<AuthStore | undefined> {
  const str = await store.getItem(AUTH_STORE_KEY);
  if (!str) {
    return undefined;
  }
  return JSON.parse(str) as AuthStore;
}

export async function setInput(
  store: PluginStore,
  input: InputStore
): Promise<void> {
  await store.setItem(INPUT_STORE_KEY, JSON.stringify(input));
}

export async function setAuth(
  store: PluginStore,
  auth: AuthStore
): Promise<void> {
  await store.setItem(AUTH_STORE_KEY, JSON.stringify(auth));
}

export async function clearInput(store: PluginStore): Promise<void> {
  await store.removeItem(INPUT_STORE_KEY);
}

export async function clearAuth(store: PluginStore): Promise<void> {
  await store.removeItem(AUTH_STORE_KEY);
}
