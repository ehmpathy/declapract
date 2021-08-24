import { DomainObject } from 'domain-objects';
import Joi from 'joi';

const schema = Joi.object().keys({
  'use-cases': Joi.object().pattern(/.*/, Joi.array().items(Joi.string().required())),
});

export interface UseCasesDeclarationInput {
  'use-cases': Record<string, string[]>;
}
export class UseCasesDeclarationInput extends DomainObject<UseCasesDeclarationInput>
  implements UseCasesDeclarationInput {
  public static schema = schema;
}
