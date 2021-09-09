import { DomainObject } from 'domain-objects';
import Joi from 'joi';
import { ProjectVariablesImplementation } from '../constants';

const schema = Joi.object().keys({
  relativeFilePath: Joi.string().required(),
  projectVariables: Joi.object().required(), // specifies which variables to use
  declaredFileContents: Joi.string()
    .allow(null)
    .required(),
  getProjectRootDirectory: Joi.function().required(),
});

/**
 * info about the context in which a file is checked
 */
export interface FileCheckContext {
  relativeFilePath: string;
  projectVariables: ProjectVariablesImplementation;
  /**
   * the file contents that were declared to be checked against
   */
  declaredFileContents: string | null;
  getProjectRootDirectory: () => string; // as a function, to prevent it showing up in snapshots (since root will be different on ci vs local test machine) // TODO: think through if there's a better way to handle this
}
export class FileCheckContext extends DomainObject<FileCheckContext> implements FileCheckContext {
  public static schema = schema;
}
