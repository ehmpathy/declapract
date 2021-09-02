import { DomainObject } from 'domain-objects';
import Joi from 'joi';

import { FileCheckEvaluation, FileEvaluationResult, hasFailed, isFixableCheck } from './';
import { PracticeDeclaration } from './PracticeDeclaration';

/**
 * a practice is fixable if every check that failed is fixable
 */
export const isFixablePractice = (evaluation: FilePracticeEvaluation): boolean =>
  evaluation.checks.filter(hasFailed).every(isFixableCheck); // if every check that failed is fixable, then fixable

const schema = Joi.object().keys({
  path: Joi.string().required(),
  result: Joi.string()
    .valid(...Object.values(FileEvaluationResult))
    .required(),
  checks: Joi.array().items(FileCheckEvaluation.schema),
  practice: PracticeDeclaration.schema.required(),
});

/**
 * a file evaluated in the context of a practice
 */
export interface FilePracticeEvaluation {
  path: string;
  result: FileEvaluationResult; // overall summary
  checks: FileCheckEvaluation[];
  practice: PracticeDeclaration;
}
export class FilePracticeEvaluation extends DomainObject<FilePracticeEvaluation> implements FilePracticeEvaluation {
  public static schema = schema;
}
