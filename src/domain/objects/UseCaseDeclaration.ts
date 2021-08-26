import { DomainObject } from 'domain-objects';
import Joi from 'joi';
import { ExampleDeclaration } from './ExampleDeclaration';

import { PracticeDeclaration } from './PracticeDeclaration';

const schema = Joi.object().keys({
  name: Joi.string().required(),
  practices: Joi.array()
    .items(PracticeDeclaration.schema)
    .required(),
  example: ExampleDeclaration.schema.allow(null),
});

export interface UseCaseDeclaration {
  name: string;
  practices: PracticeDeclaration[];
  example: ExampleDeclaration | null;
}
export class UseCaseDeclaration extends DomainObject<UseCaseDeclaration> implements UseCaseDeclaration {
  public static schema = schema;
}
