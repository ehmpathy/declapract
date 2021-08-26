import { DomainObject } from 'domain-objects';
import Joi from 'joi';
import { DeclaredPractices } from './DeclaredPractices';

const schema = Joi.object().keys({
  rootDir: Joi.string().required(), // dir of config file, to which all config paths are relative
  declared: DeclaredPractices.schema.required(), // the declared practices to use
  useCase: Joi.string().required(), // specifies which use case to use
  variables: Joi.object().required(), // specifies which variables to use
});

export interface ActionUsePracticesConfig {
  rootDir: string;
  declared: DeclaredPractices;
  useCase: string;
  variables: Record<string, any>;
}
export class ActionUsePracticesConfig extends DomainObject<ActionUsePracticesConfig>
  implements ActionUsePracticesConfig {
  public static schema = schema;
}
