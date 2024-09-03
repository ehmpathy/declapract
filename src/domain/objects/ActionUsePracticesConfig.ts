import { DomainObject } from 'domain-objects';
import Joi from 'joi';
import { PickAny } from 'type-fns';

import { ProjectVariablesImplementation } from '../constants';
import { DeclaredPractices } from './DeclaredPractices';

const schema = Joi.object().keys({
  rootDir: Joi.string().required(), // dir of config file, to which all config paths are relative
  declared: DeclaredPractices.schema.required(), // the declared practices to use
  scope: Joi.object().keys({
    usecase: Joi.string().required().allow(null),
    practices: Joi.array().items(Joi.string().required()),
  }),
  variables: Joi.object().required(), // specifies which variables to use
});

export interface ActionUsePracticesConfig {
  rootDir: string;
  declared: DeclaredPractices;
  scope: PickAny<{
    usecase: string | null;
    practices: string[];
  }>;
  variables: ProjectVariablesImplementation;
}
export class ActionUsePracticesConfig
  extends DomainObject<ActionUsePracticesConfig>
  implements ActionUsePracticesConfig
{
  public static schema = schema;
}
