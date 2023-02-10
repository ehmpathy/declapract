import { DomainObject } from 'domain-objects';
import Joi from 'joi';

const schema = Joi.object().keys({
  declare: Joi.object()
    .keys({
      examples: Joi.string().optional(),
      'use-cases': Joi.string().required(),
      practices: Joi.string().required(),
    })
    .required(),
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
