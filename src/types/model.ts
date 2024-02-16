/**
 * Typings lifted from Insomnia source
 * @see https://github.com/Kong/insomnia
 */

export type BaseModel = {
  _id: string;
  type: string;
  // TSCONVERSION -- parentId is always required for all models, except 4:
  //   - Stats, Settings, and Project, which never have a parentId
  //   - Workspace optionally has a parentId (which will be the id of a Project)
  parentId: string; // or null
  modified: number;
  created: number;
  isPrivate: boolean;
  name: string;
};
