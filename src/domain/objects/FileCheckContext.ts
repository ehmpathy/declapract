import { DomainObject } from 'domain-objects';
import Joi from 'joi';
import { ProjectVariablesImplementation } from '../constants';

const schema = Joi.object().keys({
  relativeFilePath: Joi.string().required(),
  projectRootDirectory: Joi.string().required(),
  projectVariables: Joi.object().required(), // specifies which variables to use
});

/**
 * info about the context in which a file is checked
 */
export interface FileCheckContext {
  relativeFilePath: string;
  projectRootDirectory: string;
  projectVariables: ProjectVariablesImplementation;
}
export class FileCheckContext extends DomainObject<FileCheckContext> implements FileCheckContext {
  public static schema = schema;
}
