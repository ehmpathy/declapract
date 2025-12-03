import { DomainObject } from 'domain-objects';
import Joi from 'joi';

import type { ProjectVariablesImplementation } from '../constants';

const schema = Joi.object().keys({
  relativeFilePath: Joi.string().required(),
  projectPractices: Joi.array().items(Joi.string()).required(),
  projectVariables: Joi.object().required(), // specifies which variables to use
  declaredFileContents: Joi.string().allow(null).required(),
  getProjectRootDirectory: Joi.function().required(),
  required: Joi.boolean().required(),
});

/**
 * info about the context in which a file is checked
 */
export interface FileCheckContext {
  /**
   * the path of the file being checked, relative to the project root
   */
  relativeFilePath: string;

  /**
   * the variables declared for this project
   */
  projectVariables: ProjectVariablesImplementation;

  /**
   * the names of the practices enabled for this project
   */
  projectPractices: string[];

  /**
   * the file contents that were declared to be checked against
   */
  declaredFileContents: string | null;

  /**
   * defines whether this file is required or optional
   */
  required: boolean;

  /**
   * enables getting the root directory of the project being evaluated
   */
  getProjectRootDirectory: () => string; // as a function, to prevent it showing up in snapshots (since root will be different on ci vs local test machine) // TODO: think through if there's a better way to handle this
}
export class FileCheckContext
  extends DomainObject<FileCheckContext>
  implements FileCheckContext
{
  public static schema = schema;
}
