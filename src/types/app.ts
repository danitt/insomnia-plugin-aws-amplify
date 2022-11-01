/**
 * Typings lifted from Insomnia source
 * @see https://github.com/Kong/insomnia
 */

export type AppContext = {
  alert: (title: string, message?: string) => Promise<undefined>;
  dialog: (title: string) => void;
  prompt: (
    title: string,
    body: Record<string, unknown>,
    options?: Pick<
      PromptModalOptions,
      'label' | 'defaultValue' | 'submitName' | 'cancelable'
    >
  ) => Promise<string>;
  getPath: (name: string) => string;
  getInfo: () => AppInfo;
  showSaveDialog: (options?: ShowDialogOptions) => Promise<string | null>;
  clipboard: AppClipboard;
  /**
   * @deprecated as it was never officially supported
   */
  showGenericModalDialog: (
    title: string,
    options?: ShowGenericModalDialogOptions
  ) => void;
};

type AppInfo = {
  version: string;
  platform: NodeJS.Platform;
};

type AppClipboard = {
  readText(): string;
  writeText(text: string): void;
  clear(): void;
};

type PromptModalOptions = {
  title: string;
  defaultValue?: string;
  submitName?: string;
  selectText?: boolean;
  upperCase?: boolean;
  hint?: string;
  cancelable?: boolean;
  inputType?: string;
  placeholder?: string;
  validate?: (arg0: string) => string;
  label?: string;
  hints?: string[];
  onComplete?: (arg0: string) => Promise<void> | void;
  onHide?: () => void;
  onDeleteHint?: (arg0?: string) => void;
};

type ShowDialogOptions = {
  defaultPath?: string;
};

type ShowGenericModalDialogOptions = {
  html?: string;
};
