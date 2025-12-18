import { DomainObject } from 'domain-objects';
import Joi from 'joi';

import { ProjectCheckDeclaration } from './ProjectCheckDeclaration';

const schema = Joi.object().keys({
  name: Joi.string().required(),
  bestPractice: ProjectCheckDeclaration.schema.allow(null).required(),
  badPractices: Joi.array().items(ProjectCheckDeclaration.schema).required(),
});

/**
 * defines a software practice that can be observed in a code base
 *
 * for example: 'never use `moment.js`' is a practice an org can adopt
 */
export interface PracticeDeclaration {
  name: string;
  bestPractice: ProjectCheckDeclaration | null;
  badPractices: ProjectCheckDeclaration[];
}
export class PracticeDeclaration
  extends DomainObject<PracticeDeclaration>
  implements PracticeDeclaration
{
  public static schema = schema;
}
