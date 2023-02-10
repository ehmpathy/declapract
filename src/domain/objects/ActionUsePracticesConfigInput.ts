import { DomainObject } from 'domain-objects';
import Joi from 'joi';

const schema = Joi.object().keys({
  declarations: Joi.string().required(), // either an ssh path to a git repo - or a file path to a local directory
  useCase: Joi.string().required(), // specifies which use case to use
  variables: Joi.object().optional(), // specifies which variables to use
});

export interface ActionUsePracticesConfigInput {
  declarations: string;
  useCase: string;
  variables?: Record<string, any>;
}
export class ActionUsePracticesConfigInput
  extends DomainObject<ActionUsePracticesConfigInput>
  implements ActionUsePracticesConfigInput
{
  public static schema = schema;
}
