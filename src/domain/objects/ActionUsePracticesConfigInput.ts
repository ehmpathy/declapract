import { DomainObject } from 'domain-objects';
import Joi from 'joi';
import type { PickAny } from 'type-fns';

const schema = Joi.object().keys({
  declarations: Joi.string().required(), // either an ssh path to a git repo - or a file path to a local directory
  useCase: Joi.string().required().optional(), // specifies which use case to use
  scope: Joi.object()
    .keys({
      usecase: Joi.string().required().optional(),
      practices: Joi.array().items(Joi.string().required()),
    })
    .optional(),
  variables: Joi.object().optional(), // specifies which variables to use
});

export interface ActionUsePracticesConfigInput {
  declarations: string;
  useCase?: string;
  scope?: PickAny<{
    usecase: string;
    practices: string[];
  }>;
  variables?: Record<string, any>;
}
export class ActionUsePracticesConfigInput
  extends DomainObject<ActionUsePracticesConfigInput>
  implements ActionUsePracticesConfigInput
{
  public static schema = schema;
}
