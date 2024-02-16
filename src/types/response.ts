/**
 * Typings lifted from Insomnia source
 * @see https://github.com/Kong/insomnia
 */

import { BaseModel } from './model';

export type ResponseHeader = {
  name: string;
  value: string;
};

type Compression = 'zip' | null | '__NEEDS_MIGRATION__' | undefined;

export type BaseResponse = {
  environmentId: string | null;
  statusCode: number;
  statusMessage: string;
  httpVersion: string;
  contentType: string;
  url: string;
  bytesRead: number;
  bytesContent: number;
  elapsedTime: number;
  headers: ResponseHeader[];
  bodyPath: string;
  // Actual bodies are stored on the filesystem
  timelinePath: string;
  // Actual timelines are stored on the filesystem
  bodyCompression: Compression;
  error: string;
  requestVersionId: string | null;
  // Things from the request
  settingStoreCookies: boolean | null;
  settingSendCookies: boolean | null;
};

export type Response = BaseModel & BaseResponse;
