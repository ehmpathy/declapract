import { DomainObject } from 'domain-objects';
import Joi from 'joi';
import { CheckFileDeclaration } from '.';

export enum CheckFileEvaluationResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
}

const schema = Joi.object().keys({
  practiceRef: Joi.string().required(),
  check: CheckFileDeclaration.schema.required(),
  path: Joi.string().required(),
  result: Joi.string()
    .valid(...Object.values(CheckFileEvaluationResult))
    .required(),
  reason: Joi.string()
    .required()
    .allow(null),
});

export interface CheckFileEvaluation {
  practiceRef: string; // a reference string that identifies which practice this evaluation was for (e.g., "${practice.name}.best" | "${practice.name}.bad.${project.name}")
  check: CheckFileDeclaration;
  path: string; // relative path to the file that was checked (may differ from declaration.path, since declaration.path is generically a glob pattern)
  result: CheckFileEvaluationResult;
  reason: string | null; // the reason for this conclusion
}

export class CheckFileEvaluation extends DomainObject<CheckFileEvaluation> implements CheckFileEvaluation {
  public static schema = schema;
}
