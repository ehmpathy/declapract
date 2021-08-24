import { DomainObject } from 'domain-objects';
import Joi from 'joi';
import { FileCheckFunction, FileCheckType } from '.';

const schema = Joi.object().keys({
  type: Joi.string()
    .valid(...Object.values(FileCheckType))
    .optional(),
  optional: Joi.boolean().optional(),
  function: Joi.function().optional(),
});

/**
 * allows user to specify what they want to check in a file
 *
 *
 * for example:
 *
 * - check that the file exists
 *     ```
 *         // shorthand
 *         export const check = FileCheckType.EXISTS;
 *
 *         // or if you'd like to be more explicit
 *         export const check: CheckFileDeclarationInput = { type: FileCheckType.EXISTS };
 *     ```
 *
 * - check that it contains the declared content, only if the file exists (i.e., don't require it to exist, but if it does exist, require the contents to match)
 *     ```
 *         // shorthand, since type: FileCheckType.EQUALS by default
 *         export const check = { optional: true };
 *
 *         // or if you'd like to be more explicit
 *         export const check: CheckFileDeclarationInput = { type: FileCheckType.EQUALS, optional: true };
 *     ```
 *
 * - check that the file _contains_ the declared content anywhere inside of it
 *     ```
 *         // shorthand
 *         export const check = FileCheckType.CONTAINS;
 *
 *         // or if you'd like to be more explicit
 *         export const check: CheckFileDeclarationInput = { type: FileCheckType.CONTAINS };
 *     ```
 *
 * - use a custom check method to check that a package.json has the correct version of a package
 *     ```
 *           import { defineMinPackageVersionRegex, FileCheckFunction } from 'declapract';
 *
 *           // shorthand
 *           export const check: FileCheckFunction = (contents: string) => {
 *             const parsedPackageJson = JSON.parse(contents);
 *             expect(parsedPackageJson).toMatchObject({
 *               devDependencies: expect.objectContaining({
 *                 prettier: expect.stringMatching(defineMinPackageVersionRegex('2.0.0')),
 *               }),
 *             });
 *           }
 *
 *           // or if you'd like to be more explicit
 *           export const check: CheckFileDeclarationInput = {
 *             type: FileCheckType.CUSTOM,
 *             function: (contents: string) => {
 *               const parsedPackageJson = JSON.parse(contents);
 *               expect(parsedPackageJson).toMatchObject({
 *                 devDependencies: expect.objectContaining({
 *                   prettier: expect.stringMatching(defineMinPackageVersionRegex('2.0.0')),
 *                 }),
 *               });
 *             },
 *           }
 *     ```
 */
export interface CheckFileDeclarationInput {
  /**
   * specifies what type of check to run
   */
  type?: FileCheckType;

  /**
   * specifies whether or not the file is required to be checked
   * - when true, if the file does not exist the check will pass
   * - when false, if the file does not exist the check will fail
   *
   * default: false
   */
  optional?: boolean;

  /**
   * specifies a custom check function to run
   */
  function?: FileCheckFunction;
}
export class CheckFileDeclarationInput extends DomainObject<CheckFileDeclarationInput>
  implements CheckFileDeclarationInput {
  public static schema = schema;
}
