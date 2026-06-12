import { DomainObject } from 'domain-objects';
import { z } from 'zod';

const schema = z.object({
  'use-cases': z.record(
    z.string(),
    z.object({
      example: z.string().optional(),
      extends: z.array(z.string()).optional(),
      practices: z.array(z.string()).min(1),
    }),
  ),
});

export interface UseCasesDeclarationInput {
  'use-cases': Record<
    string,
    {
      example?: string;
      extends?: string[];
      practices: string[];
    }
  >;
}
export class UseCasesDeclarationInput
  extends DomainObject<UseCasesDeclarationInput>
  implements UseCasesDeclarationInput
{
  public static schema = schema;
}
