import { DomainObject } from 'domain-objects';
import Joi from 'joi';

import { ExampleDeclaration } from './ExampleDeclaration';
import { PracticeDeclaration } from './PracticeDeclaration';
import { UseCaseDeclaration } from './UseCaseDeclaration';

const schema = Joi.object().keys({
  rootDir: Joi.string().required(), // dir of config file, to which all config paths are relative
  examples: Joi.array().items(ExampleDeclaration.schema).required(),
  useCases: Joi.array().items(UseCaseDeclaration.schema).required(),
  practices: Joi.array().items(PracticeDeclaration.schema).min(1),
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
