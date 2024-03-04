/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Typings lifted from Insomnia source
 * @see https://github.com/Kong/insomnia
 */

import { AppContext } from './app';
import type { NunjucksParsedTagArg } from './plugin';
import type { Request } from './request';
import type { Response } from './response';

export type PluginArgumentValue = string | number | boolean;

type DisplayName = string | ((args: NunjucksParsedTagArg[]) => string);

type PluginArgumentBase = {
  displayName: DisplayName;
  description?: string;
  help?: string;
  hide?: (args: NunjucksParsedTagArg[]) => boolean;
  /* Undocumented method */
  validate?: (arg: PluginArgumentValue) => string | null;
};

export type PluginArgumentEnumOption = {
  displayName: DisplayName;
  value: PluginArgumentValue;
  description?: string;
  placeholder?: string;
};

export type PluginArgumentEnum = PluginArgumentBase & {
  type: 'enum';
  options: PluginArgumentEnumOption[];
  defaultValue?: PluginArgumentValue;
};

export type PluginArgumentModel = PluginArgumentBase & {
  type: 'model';
  model: string;
  defaultValue?: string;
};

export type PluginArgumentString = PluginArgumentBase & {
  type: 'string';
  placeholder?: string;
  defaultValue?: string;
};

export type PluginArgumentBoolean = PluginArgumentBase & {
  type: 'boolean';
  defaultValue?: boolean;
};

export type PluginArgumentFile = PluginArgumentBase & {
  type: 'file';
};

export type PluginArgumentNumber = PluginArgumentBase & {
  type: 'number';
  placeholder?: string;
  defaultValue?: number;
};

export type PluginArgument =
  | PluginArgumentEnum
  | PluginArgumentModel
  | PluginArgumentString
  | PluginArgumentBoolean
  | PluginArgumentFile
  | PluginArgumentNumber;

export type PluginTemplateTagContext = {
  app: AppContext;
  util: {
    models: {
      request: {
        getById: (id: string) => Promise<Request | null>;
      };
      response: {
        getLatestForRequestId: (id: string) => Promise<Response | null>;
        getBodyBuffer: (
          response: Response,
          fallback?: any,
        ) => Promise<Buffer | null>;
      };
    };
  };
  /* Undocumented property */
  store: PluginStore;
};

export type PluginStore = {
  hasItem(arg0: string): Promise<boolean>;
  setItem(arg0: string, arg1: string): Promise<void>;
  getItem(arg0: string): Promise<string | null>;
  removeItem(arg0: string): Promise<void>;
  clear(): Promise<void>;
  all(): Promise<
    {
      key: string;
      value: string;
    }[]
  >;
};

export type PluginTemplateTagActionContext = {
  store: PluginStore;
};

export type PluginTemplateTagAction = {
  name: string;
  icon?: string;
  run: (context: PluginTemplateTagActionContext) => Promise<void>;
};

export type PluginTemplateTag = {
  name: string;
  run: (context: PluginTemplateTagContext, ...arg: any[]) => Promise<any> | any;
  displayName: DisplayName;
  disablePreview: (args: NunjucksParsedTagArg[]) => boolean;
  description: string;
  actions: PluginTemplateTagAction[];
  args: PluginArgument[];
  deprecated?: boolean;
  validate?: (value: any) => string | null;
  priority?: number;
};
