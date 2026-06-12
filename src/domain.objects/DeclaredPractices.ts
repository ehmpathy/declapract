import { DomainObject } from 'domain-objects';
import { z } from 'zod';

import { ExampleDeclaration } from './ExampleDeclaration';
import { PracticeDeclaration } from './PracticeDeclaration';
import { UseCaseDeclaration } from './UseCaseDeclaration';

const schema = z.object({
  rootDir: z.string(), // dir of config file, to which all config paths are relative
  examples: z.array(ExampleDeclaration.schema),
  useCases: z.array(UseCaseDeclaration.schema),
  practices: z.array(PracticeDeclaration.schema).min(1),
});

export interface DeclaredPractices {
  rootDir: string;
  examples: ExampleDeclaration[];
  useCases: UseCaseDeclaration[];
  practices: PracticeDeclaration[];
}
export class DeclaredPractices
  extends DomainObject<DeclaredPractices>
  implements DeclaredPractices
{
  public static schema = schema;
}
