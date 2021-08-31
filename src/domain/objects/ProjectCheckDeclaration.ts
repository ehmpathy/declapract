import { DomainObject } from 'domain-objects';
import Joi from 'joi';
import { FileCheckDeclaration } from './FileCheckDeclaration';

const schema = Joi.object().keys({
  name: Joi.string().required(),
  readme: Joi.string()
    .required()
    .allow(null),
  checks: Joi.array()
    .items(FileCheckDeclaration.schema)
    .required()
    .min(1),
});

export interface ProjectCheckDeclaration {
  name: string;
  readme: string | null;
  checks: FileCheckDeclaration[];
}
export class ProjectCheckDeclaration extends DomainObject<ProjectCheckDeclaration> implements ProjectCheckDeclaration {
  public static schema = schema;
}
