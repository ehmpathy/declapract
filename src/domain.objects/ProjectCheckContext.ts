import { DomainObject } from 'domain-objects';
import { z } from 'zod';

import type { ProjectVariablesImplementation } from '@src/domain.objects/constants';

const schema = z.object({
  projectVariables: z.record(z.string(), z.unknown()),
  projectPractices: z.array(z.string()),
  getProjectRootDirectory: z.function(),
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
