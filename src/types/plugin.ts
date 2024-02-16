/**
 * Typings lifted from Insomnia source
 * @see https://github.com/Kong/insomnia
 */

export type PluginArgumentValue = string | number | boolean;

type DisplayName = string | ((args: NunjucksParsedTagArg[]) => string);

export type PluginArgumentEnumOption = {
  displayName: DisplayName;
  value: PluginArgumentValue;
  description?: string;
  placeholder?: string;
};

export type NunjucksParsedTagArg = {
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'variable'
    | 'expression'
    | 'enum'
    | 'file'
    | 'model';
  encoding?: 'base64';
  value: string | number | boolean;
  defaultValue?: string | number | boolean;
  forceVariable?: boolean;
  placeholder?: string;
  help?: string;
  displayName?: string;
  quotedBy?: '"' | "'";
  validate?: (value: unknown) => string;
  hide?: (arg0: NunjucksParsedTagArg[]) => boolean;
  model?: string;
  options?: PluginArgumentEnumOption[];
  itemTypes?: ('file' | 'directory')[];
  extensions?: string[];
};
