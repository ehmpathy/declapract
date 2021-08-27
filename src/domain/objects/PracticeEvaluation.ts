/*
 need a way to represent:
 - which files failed to abide by the practice
 - why

 will need to be able to say:
 - `package.json` did not include the correct version of a package (from best practice)
 - `package.json` _included_ a bad version of a package (from bad practice)

 so, we want to report, per file, all the reasons why it failed - OR - that it passed
*/

import { DomainObject } from 'domain-objects';
import Joi from 'joi';

import { CheckFileEvaluation, CheckFileEvaluationResult } from './CheckFileEvaluation';
import { PracticeDeclaration } from './PracticeDeclaration';

const schema = Joi.object().keys({
  practice: PracticeDeclaration.schema.required(),
  evaluated: Joi.array()
    .items(
      Joi.object()
        .keys({
          path: Joi.string().required(),
          result: Joi.string()
            .valid(...Object.values(CheckFileEvaluationResult))
            .required(),
          checked: Joi.object().keys({
            bestPractice: Joi.array().items(CheckFileEvaluation.schema),
            badPractices: Joi.array().items(CheckFileEvaluation.schema),
          }),
        })
        .required(),
    )
    .required(),
});

export interface PracticeEvaluation {
  practice: PracticeDeclaration;
  evaluated: {
    path: string;
    result: CheckFileEvaluationResult; // overall summary
    checked: {
      bestPractice: CheckFileEvaluation[];
      badPractices: CheckFileEvaluation[];
    };
  }[];
}
export class PracticeEvaluation extends DomainObject<PracticeEvaluation> implements PracticeEvaluation {
  public static schema = schema;
}
