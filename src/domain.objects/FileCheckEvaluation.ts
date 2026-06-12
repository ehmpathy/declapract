import { DomainObject } from 'domain-objects';
import { z } from 'zod';

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

const schema = z.object({
  practiceRef: z.string(),
  purpose: z.nativeEnum(FileCheckPurpose),
  type: z.nativeEnum(FileCheckType),
  required: z.boolean(),
  path: z.string(),
  result: z.nativeEnum(FileEvaluationResult),
  reason: z.string().nullable(),
  fix: z.function().nullable(),
  context: FileCheckContext.schema,
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
