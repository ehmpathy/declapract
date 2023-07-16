import { DomainObject } from 'domain-objects';
import Joi from 'joi';
import { createIsOfEnum } from 'type-fns';

import { FileCheckContext } from './FileCheckContext';
import { ProjectCheckContext } from './ProjectCheckContext';

export enum FileCheckPurpose {
  BAD_PRACTICE = 'BAD_PRACTICE',
  BEST_PRACTICE = 'BEST_PRACTICE',
}

export enum FileCheckType {
  /**
   * simply checks that the file exists, without considering contents
   */
  EXISTS = 'EXISTS',

  /**
   * checks that the file contents equal the declared contents
   *
   * e.g., `expect(foundContents).toEqual(declaredContents)`
   *
   * (default when file contents are declared)
   */
  EQUALS = 'EQUALS',

  /**
   * check that the file contents contain the declared contents
   *
   * e.g., `expect(foundContents).toContain(declaredContents)`
   */
  CONTAINS = 'CONTAINS',

  /**
   * check that the file contents satisfy a custom check function
   *
   * (default when the `.declapract.ts` file exports a `check` function)
   */
  CUSTOM = 'CUSTOM',
}
export const isOfFileCheckType = createIsOfEnum(FileCheckType);

/**
 * a file check function is used to evaluate whether a file fails or passes a declaration
 *
 * a file check function either:
 * - returns successfully
 * - throws an error with the message containing the reason that the check failed
 *
 * for example
 * ```ts
 *   export const check = (contents: string | null) => expect(contents).toEqual(bestPracticeContents);
 * ```
 */
export type FileCheckFunction = (
  contents: string | null,
  context: FileCheckContext,
) => Promise<void> | void;

/**
 * a file fix function is used to automatically fix files that fail your declared practices
 *
 * a file fix function can declare:
 * - what the "fixed" file contents would be (including `null` to delete the file)
 * - what the "fixed" relative file path would be
 * - a combination of the above
 *
 * _note: it is **critical** that this function runs without mutating anything, as this function is run when planning even before the user requests to apply it. it should only declare **what** the final state would be, not actually do anything_
 */
export type FileFixFunction = (
  contents: string | null,
  context: FileCheckContext,
) =>
  | { relativeFilePath?: string; contents?: string | null }
  | Promise<{ relativeFilePath?: string; contents?: string | null }>;

/**
 * a file contents function is used to dynamically define the best practice contents based on the context of the project
 *
 * for example
 * ```ts
 *   export const contents: FileContentsFunction = (context) => {
 *     if (context.projectPractices.includes('terraform')) return X
 *     else return Y
 *   }
 * ```
 */
export type FileContentsFunction = (
  context: ProjectCheckContext,
) => Promise<string> | string;

const schema = Joi.object().keys({
  pathGlob: Joi.string().required(),
  purpose: Joi.string()
    .valid(...Object.values(FileCheckPurpose))
    .required(),
  type: Joi.string()
    .valid(...Object.values(FileCheckType))
    .required(),
  required: Joi.boolean().required(),
  check: Joi.function().required(),
  fix: Joi.function().required().allow(null),
  contents: Joi.function().required().allow(null),
});

/**
 * a file check declaration is an object that defines how to check whether a file meets the declared criteria
 *
 * specifies which file and what to check for
 */
export interface FileCheckDeclaration {
  pathGlob: string;
  purpose: FileCheckPurpose;
  type: FileCheckType;
  required: boolean;
  check: FileCheckFunction;
  fix: FileFixFunction | null; // may not have a fix function possible for this check declaration
  contents: FileContentsFunction | null; // the contents that the user declared for this file, if any; required to create "FileCheckContext"
}
export class FileCheckDeclaration
  extends DomainObject<FileCheckDeclaration>
  implements FileCheckDeclaration
{
  public static schema = schema;
}
