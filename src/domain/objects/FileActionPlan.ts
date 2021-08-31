import { DomainObject } from 'domain-objects';
import Joi from 'joi';
import { RequiredAction } from '../constants';
import { FilePracticeEvaluation } from './FilePracticeEvaluation';

const schema = Joi.object().keys({
  path: Joi.string().required(),
  action: Joi.string()
    .valid(...Object.values(RequiredAction))
    .required(),
  evaluations: Joi.array()
    .items(FilePracticeEvaluation.schema)
    .required()
    .min(1),
});

/**
 * the plan for this file, based on the declared state the file should match
 */
export interface FileActionPlan {
  path: string;
  action: RequiredAction;
  evaluations: FilePracticeEvaluation[]; // the evaluated practices this plan was based on
}

export class FileActionPlan extends DomainObject<FileActionPlan> implements FileActionPlan {
  public static schema = schema;
}
