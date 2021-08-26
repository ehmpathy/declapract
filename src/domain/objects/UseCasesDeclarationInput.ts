import { DomainObject } from 'domain-objects';
import Joi from 'joi';

const schema = Joi.object().keys({
  'use-cases': Joi.object().pattern(
    /.*/,
    Joi.object().keys({
      example: Joi.string().optional(),
      extends: Joi.string().optional(),
      practices: Joi.array()
        .items(Joi.string().required())
        .min(1),
    }),
  ),
});

export interface UseCasesDeclarationInput {
  'use-cases': Record<
    string,
    {
      example?: string;
      extends?: string;
      practices: string[];
    }
  >;
}
export class UseCasesDeclarationInput extends DomainObject<UseCasesDeclarationInput>
  implements UseCasesDeclarationInput {
  public static schema = schema;
}
