import { PluginStore } from '../../types/template';

import { RootStore, UserPoolCredentials } from './types';

const STORE_KEY_PREFIX = 'danitt-aws-amplify';

const initialStoreState: RootStore = {
  input: {
    username: '',
    password: '',
    region: '',
    userPoolId: '',
    clientId: '',
  },
  auth: {
    pools: [],
  },
  error: {
    message: undefined,
  },
} as const;

async function getStore(pluginStore: PluginStore): Promise<RootStore> {
  const storeStr = await pluginStore.getItem(STORE_KEY_PREFIX);
  if (storeStr) {
    return JSON.parse(storeStr) as RootStore;
  }
  // Not exists, create and set initial
  await setStore(pluginStore, initialStoreState);
  return initialStoreState;
}

async function setStore(
  pluginStore: PluginStore,
  state: RootStore
): Promise<undefined> {
  await pluginStore.setItem(STORE_KEY_PREFIX, JSON.stringify(state));
}

export async function getInput(
  pluginStore: PluginStore
): Promise<RootStore['input']> {
  return (await getStore(pluginStore)).input;
}

export async function setInput(
  pluginStore: PluginStore,
  input: RootStore['input']
): Promise<void> {
  const store = await getStore(pluginStore);
  store.input = input;
  await setStore(pluginStore, store);
}

export async function getAuthPool(
  pluginStore: PluginStore,
  userPoolId: string
): Promise<UserPoolCredentials | undefined> {
  const store = await getStore(pluginStore);
  return store.auth.pools.find((pool) => pool.userPoolId === userPoolId);
}

export async function setAuthPool(
  pluginStore: PluginStore,
  auth: UserPoolCredentials
): Promise<void> {
  const store = await getStore(pluginStore);
  await clearAuthPool(pluginStore, auth.userPoolId);
  store.auth.pools.push(auth);
  await setStore(pluginStore, store);
}

export async function getError(
  pluginStore: PluginStore
): Promise<RootStore['error']> {
  return (await getStore(pluginStore)).error;
}

export async function setError(
  pluginStore: PluginStore,
  error: RootStore['error']
): Promise<void> {
  const store = await getStore(pluginStore);
  store.error = error;
  await setStore(pluginStore, store);
}

export async function clearInput(pluginStore: PluginStore): Promise<void> {
  const store = await getStore(pluginStore);
  store.input = initialStoreState.input;
  await setStore(pluginStore, store);
}

export async function clearAuthPool(
  pluginStore: PluginStore,
  userPoolId: string
): Promise<void> {
  const store = await getStore(pluginStore);
  store.auth.pools = store.auth.pools.filter(
    (pool) => pool.userPoolId !== userPoolId
  );
  await setStore(pluginStore, store);
}

export async function clearError(pluginStore: PluginStore): Promise<void> {
  const store = await getStore(pluginStore);
  store.error = initialStoreState.error;
  await setStore(pluginStore, store);
}
