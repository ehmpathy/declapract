import { DomainObject } from 'domain-objects';
import Joi from 'joi';
import { createIsOfEnum } from 'simple-type-guards';

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
 * a file check function either:
 * - returns successfully
 * - throws an error with the message containing the reason that the check failed
 *
 * for example
 * ```ts
 *   export const check = (contents: string | null) => expect(contents).toEqual(bestPracticeContents);
 * ```
 * _note: the above check function is the default when the expected file contents are declared on their own_
 */
export type FileCheckFunction = (contents: string | null) => Promise<void> | void;
export type FileFixFunction = (contents: string | null) => string | null;

const schema = Joi.object().keys({
  path: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(FileCheckType))
    .required(),
  required: Joi.boolean().required(),
  check: Joi.function().required(),
  fix: Joi.function()
    .required()
    .allow(null),
});

/**
 * a file check declaration is an object that defines how to check whether a file meets the declared criteria
 *
 * specifies which file and what to check for
 */
export interface CheckFileDeclaration {
  path: string;
  type: FileCheckType;
  required: boolean;
  check: FileCheckFunction;
  fix: FileFixFunction | null; // may not have a fix function possible for this check declaration
}
export class CheckFileDeclaration extends DomainObject<CheckFileDeclaration> implements CheckFileDeclaration {
  public static schema = schema;
}
