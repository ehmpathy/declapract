import { DomainObject } from 'domain-objects';
import { z } from 'zod';

const schema = z.object({
  declare: z.object({
    examples: z.string().optional(),
    'use-cases': z.string(),
    practices: z.string(),
  }),
});

export interface ActionDeclarePracticesConfigInput {
  declare: {
    examples?: string;
    'use-cases': string;
    practices: string;
  };
}
export class ActionDeclarePracticesConfigInput
  extends DomainObject<ActionDeclarePracticesConfigInput>
  implements ActionDeclarePracticesConfigInput
{
  public static schema = schema;
}
