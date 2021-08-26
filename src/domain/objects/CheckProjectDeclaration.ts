import { DomainObject } from 'domain-objects';
import Joi from 'joi';
import { CheckFileDeclaration } from './CheckFileDeclaration';

const schema = Joi.object().keys({
  name: Joi.string().required(),
  readme: Joi.string()
    .required()
    .allow(null),
  checks: Joi.array()
    .items(CheckFileDeclaration.schema)
    .required()
    .min(1),
});

export interface CheckProjectDeclaration {
  name: string;
  readme: string | null;
  checks: CheckFileDeclaration[];
}
export class CheckProjectDeclaration extends DomainObject<CheckProjectDeclaration> implements CheckProjectDeclaration {
  public static schema = schema;
}
