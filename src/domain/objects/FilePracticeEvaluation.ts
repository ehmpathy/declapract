import { DomainObject } from 'domain-objects';
import Joi from 'joi';
import { withNot } from 'simple-type-guards';
import { FileCheckEvaluation, FileEvaluationResult, hasFailed, isFixableCheck } from '.';
import { PracticeDeclaration } from './PracticeDeclaration';

/**
 * a practice is fixable if:
 * - each bestPractice check which failed is fixable
 * - no badPractice checks are passed
 *  - since we dont have a well defined way of fixing bad practice checks // TODO: better represent bad-practice checks to support fixes for them
 */
export const isFixablePractice = (evaluation: FilePracticeEvaluation): boolean => {
  if (evaluation.checked.bestPractice.filter(hasFailed).some(withNot(isFixableCheck))) return false; // if some checked best practice failed and is not fixable, then whole practice is failed
  if (evaluation.checked.badPractices.some(withNot(hasFailed))) return false; // if some bad practice has passed, then whole practice is not fixable (YET: // TODO support bad practice check fixes)
  return true;
};

const schema = Joi.object().keys({
  path: Joi.string().required(),
  result: Joi.string()
    .valid(...Object.values(FileEvaluationResult))
    .required(),
  checked: Joi.object().keys({
    bestPractice: Joi.array().items(FileCheckEvaluation.schema),
    badPractices: Joi.array().items(FileCheckEvaluation.schema),
  }),
  practice: PracticeDeclaration.schema.required(),
});

/**
 * a file evaluated in the context of a practice
 */
export interface FilePracticeEvaluation {
  path: string;
  result: FileEvaluationResult; // overall summary
  checked: {
    bestPractice: FileCheckEvaluation[];
    badPractices: FileCheckEvaluation[];
  };
  practice: PracticeDeclaration;
}
export class FilePracticeEvaluation extends DomainObject<FilePracticeEvaluation> implements FilePracticeEvaluation {
  public static schema = schema;
}
