import { DomainObject } from 'domain-objects';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  exampleRootDirectory: z.string(),
});

/**
 * defines an example that can be used to check use-case declarations against and to clone new projects from
 */
export interface ExampleDeclaration {
  name: string;
  exampleRootDirectory: string;
}
export class ExampleDeclaration
  extends DomainObject<ExampleDeclaration>
  implements ExampleDeclaration
{
  public static schema = schema;
}
