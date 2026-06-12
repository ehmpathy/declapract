import { DomainObject } from 'domain-objects';
import { z } from 'zod';

import type { ProjectVariablesImplementation } from '@src/domain.objects/constants';

const schema = z.object({
  relativeFilePath: z.string(),
  projectPractices: z.array(z.string()),
  projectVariables: z.record(z.string(), z.unknown()), // specifies which variables to use
  declaredFileContents: z.string().nullable(),
  getProjectRootDirectory: z.function(),
  required: z.boolean(),
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
