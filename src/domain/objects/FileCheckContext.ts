import { DomainObject } from 'domain-objects';
import Joi from 'joi';
import { ProjectVariablesImplementation } from '../constants';

const schema = Joi.object().keys({
  relativeFilePath: Joi.string().required(),
  projectRootDirectory: Joi.string().required(),
  projectVariables: Joi.object().required(), // specifies which variables to use
  declaredFileContents: Joi.string()
    .allow(null)
    .required(),
});

/**
 * info about the context in which a file is checked
 */
export interface FileCheckContext {
  relativeFilePath: string;
  projectRootDirectory: string;
  projectVariables: ProjectVariablesImplementation;
  /**
   * the file contents that were declared to be checked against
   */
  declaredFileContents: string | null;
}
export class FileCheckContext extends DomainObject<FileCheckContext> implements FileCheckContext {
  public static schema = schema;
}
