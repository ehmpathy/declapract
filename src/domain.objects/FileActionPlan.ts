import { DomainObject } from 'domain-objects';
import { z } from 'zod';

import { RequiredAction } from '@src/domain.objects/constants';

import { FilePracticeEvaluation } from './FilePracticeEvaluation';

const schema = z.object({
  path: z.string(),
  action: z.nativeEnum(RequiredAction),
  evaluations: z.array(FilePracticeEvaluation.schema).min(1),
});

/**
 * the plan for this file, based on the declared state the file should match
 */
export interface FileActionPlan {
  path: string;
  action: RequiredAction;
  evaluations: FilePracticeEvaluation[]; // the evaluated practices this plan was based on
}

export class FileActionPlan
  extends DomainObject<FileActionPlan>
  implements FileActionPlan
{
  public static schema = schema;
}
