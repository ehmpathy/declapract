import { DomainObject } from 'domain-objects';
import Joi from 'joi';

import { FileCheckContext } from './FileCheckContext';
import {
  FileCheckPurpose,
  FileCheckType,
  type FileFixFunction,
} from './FileCheckDeclaration';

export enum FileEvaluationResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
}
export const hasFailed = (evaluation: {
  result: FileEvaluationResult;
}): boolean => evaluation.result === FileEvaluationResult.FAIL;
export const hasPassed = (evaluation: {
  result: FileEvaluationResult;
}): boolean => evaluation.result === FileEvaluationResult.PASS;

// check is fixable if it has a fix function
export const isFixableCheck = (evaluation: FileCheckEvaluation): boolean =>
  !!evaluation.fix;

const schema = Joi.object().keys({
  practiceRef: Joi.string().required(),
  purpose: Joi.string()
    .valid(...Object.values(FileCheckPurpose))
    .required(),
  type: Joi.string()
    .valid(...Object.values(FileCheckType))
    .required(),
  required: Joi.boolean().required(),
  path: Joi.string().required(),
  result: Joi.string()
    .valid(...Object.values(FileEvaluationResult))
    .required(),
  reason: Joi.string().required().allow(null),
  fix: Joi.function().allow(null).required(),
  context: FileCheckContext.schema.required(),
});

/**
 * the result of evaluating a check on a file
 */
export interface FileCheckEvaluation {
  practiceRef: string; // a reference string that identifies which practice this evaluation was for (e.g., "${practice.name}.best" | "${practice.name}.bad.${project.name}")
  purpose: FileCheckPurpose; // this evaluated in context of a "best practice" or a "bad practice"
  type: FileCheckType;
  required: boolean;
  path: string; // relative path to the file that was checked (may differ from declaration.path, since declaration.path is generically a glob pattern)
  result: FileEvaluationResult;
  reason: string | null; // the reason for this conclusion
  fix: FileFixFunction | null;
  context: FileCheckContext;
}

export class FileCheckEvaluation
  extends DomainObject<FileCheckEvaluation>
  implements FileCheckEvaluation
{
  public static schema = schema;
}
