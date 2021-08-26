import { DomainObject } from 'domain-objects';
import Joi from 'joi';

const schema = Joi.object().keys({
  name: Joi.string().required(),
});

/**
 * defines an example that can be used to check use-case declarations against and to clone new projects from
 */
export interface ExampleDeclaration {
  name: string;
}
export class ExampleDeclaration extends DomainObject<ExampleDeclaration> implements ExampleDeclaration {
  public static schema = schema;
}
