import { DomainObject } from 'domain-objects';
import { z } from 'zod';

import { ProjectCheckDeclaration } from './ProjectCheckDeclaration';

const schema = z.object({
  name: z.string(),
  bestPractice: ProjectCheckDeclaration.schema.nullable(),
  badPractices: z.array(ProjectCheckDeclaration.schema),
});

/**
 * defines a software practice that can be observed in a code base
 *
 * for example: 'never use `moment.js`' is a practice an org can adopt
 */
export interface PracticeDeclaration {
  name: string;
  bestPractice: ProjectCheckDeclaration | null;
  badPractices: ProjectCheckDeclaration[];
}
export class PracticeDeclaration
  extends DomainObject<PracticeDeclaration>
  implements PracticeDeclaration
{
  public static schema = schema;
}
