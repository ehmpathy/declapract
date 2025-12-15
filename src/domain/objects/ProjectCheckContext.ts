import { DomainObject } from 'domain-objects';
import Joi from 'joi';

import type { ProjectVariablesImplementation } from '@src/domain/constants';

const schema = Joi.object().keys({
  projectVariables: Joi.object().required(),
  projectPractices: Joi.array().items(Joi.string()).required(),
  getProjectRootDirectory: Joi.function().required(),
});

/**
 * info about the context in which a project is checked
 */
export interface ProjectCheckContext {
  /**
   * the variables declared for this project
   */
  projectVariables: ProjectVariablesImplementation;

  /**
   * the names of the practices enabled for this project
   */
  projectPractices: string[];

  /**
   * enables getting the root directory of the project being evaluated
   */
  getProjectRootDirectory: () => string; // as a function, to prevent it showing up in snapshots (since root will be different on ci vs local test machine) // TODO: think through if there's a better way to handle this
}
export class ProjectCheckContext
  extends DomainObject<ProjectCheckContext>
  implements ProjectCheckContext
{
  public static schema = schema;
}
