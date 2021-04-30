export interface IContext {
  app: {
    alert(title: string, message?: string): Promise<void>;
    prompt(title: string, options?: {
      label?: string,
      defaultValue?: string,
      submitName?: string,
      cancelable?: boolean,
    }): Promise<string>;
    getPath(name: 'desktop'): string;
    showSaveDialog: (options: { defaultPath?: string }) => Promise<string | null>;
  };
  store: {
    hasItem(key: string): Promise<boolean>;
    setItem(key: string, value: string): Promise<void>;
    getItem(key: string): Promise<string | null>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    all(): Promise<Array<{ key: string, value: string }>>;
  };
}

export interface ICognitoUserSessionData {
  IdToken: string;
  AccessToken: string;
  RefreshToken?: string;
}
