/**
 * Typings lifted from Insomnia source
 * @see https://github.com/Kong/insomnia
 */

import { BaseModel } from './model';

export type RequestAuthentication = Record<string, unknown>;

export type RequestHeader = {
  name: string;
  value: string;
  description?: string;
  disabled?: boolean;
};

export type RequestParameter = {
  name: string;
  value: string;
  disabled?: boolean;
  id?: string;
  fileName?: string;
};

export type RequestBodyParameter = {
  name: string;
  value: string;
  description?: string;
  disabled?: boolean;
  multiline?: string;
  id?: string;
  fileName?: string;
  type?: string;
};

export type RequestBody = {
  mimeType?: string | null;
  text?: string;
  fileName?: string;
  params?: RequestBodyParameter[];
};

export type BaseRequest = {
  url: string;
  name: string;
  description: string;
  method: string;
  body: RequestBody;
  parameters: RequestParameter[];
  headers: RequestHeader[];
  authentication: RequestAuthentication;
  metaSortKey: number;
  isPrivate: boolean;
  // Settings
  settingStoreCookies: boolean;
  settingSendCookies: boolean;
  settingDisableRenderRequestBody: boolean;
  settingEncodeUrl: boolean;
  settingRebuildPath: boolean;
  settingFollowRedirects: 'global' | 'on' | 'off';
};

export type Request = BaseModel & BaseRequest;
