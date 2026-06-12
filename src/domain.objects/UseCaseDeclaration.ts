import { DomainObject } from 'domain-objects';
import { z } from 'zod';

import { ExampleDeclaration } from './ExampleDeclaration';
import { PracticeDeclaration } from './PracticeDeclaration';

const schema = z.object({
  name: z.string(),
  practices: z.array(PracticeDeclaration.schema),
  example: ExampleDeclaration.schema.nullable(),
});

export interface UseCaseDeclaration {
  name: string;
  practices: PracticeDeclaration[];
  example: ExampleDeclaration | null;
}
export class UseCaseDeclaration
  extends DomainObject<UseCaseDeclaration>
  implements UseCaseDeclaration
{
  public static schema = schema;
}
