import path from 'path';

import type { FileCheckContext, FileFixFunction } from '@src/domain.objects';
import {
  CHECK_MIN_VERSION_REGEX_GLOBAL,
  checkDoesFoundValuePassesMinVersionCheck,
  getMinVersionFromCheckMinVersionExpression,
  hasIfInstalledModifier,
  isCheckMinVersionExpression,
} from '@src/domain.operations/declaration/readPracticeDeclarations/readPracticeDeclaration/getFileCheckDeclaration/checkExpressions/check.minVersion';
import { UnexpectedCodePathError } from '@src/domain.operations/UnexpectedCodePathError';
import { readFileIfExistsAsync } from '@src/utils/fileio/readFileIfExistsAsync';
import { parseJSON } from '@src/utils/json/parseJSON';

import { processSelfDepsForFix } from './processSelfDepsForFix';

/**
 * .what = gets the target package name from the project root package.json
 * .why = needed to detect and filter self-deps in fix phase
 */
const getTargetPackageName = async (
  context: FileCheckContext,
): Promise<string | null> => {
  const projectRoot = context.getProjectRootDirectory();
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const contents = await readFileIfExistsAsync({ filePath: packageJsonPath });
  if (!contents) return null;
  const parsed = parseJSON<{ name?: unknown }>(contents);
  return typeof parsed?.name === 'string' ? parsed.name : null;
};

/**
 * recursively filters out keys with .ifInstalled() modifier from an object
 *
 * .why = when creating a new file, deps with .ifInstalled() should be omitted
 *        since they're optional and the file doesn't exist yet
 */
const deepFilterIfInstalledKeys = (obj: unknown): unknown => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepFilterIfInstalledKeys);

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    // skip keys with .ifInstalled() modifier
    if (typeof value === 'string' && hasIfInstalledModifier(value)) continue;

    // recurse into nested objects
    result[key] = deepFilterIfInstalledKeys(value);
  }
  return result;
};

/**
 * e.g., replace a `@declapract{check.minVersion('..')}` strings in the declared contents
 *
 * typically used to create a new file from declarations
 *
 * .note = omits keys with .ifInstalled() modifier since the file doesn't exist yet
 */
const deepReplaceAllCheckExpressionsFromDeclaredContentsString = ({
  declaredContents,
}: {
  declaredContents: string;
}) => {
  // parse, filter out .ifInstalled() keys, then stringify
  const parsed = parseJSON(declaredContents);
  const filtered = deepFilterIfInstalledKeys(parsed);
  const filteredString = JSON.stringify(filtered, null, 2);

  // reset global regex state and replace remaining check expressions
  CHECK_MIN_VERSION_REGEX_GLOBAL.lastIndex = 0;
  return filteredString.replace(CHECK_MIN_VERSION_REGEX_GLOBAL, '$1');
};

/**
 * replaces the value of each key in `currentObject` with the value of that key in `desiredObject`, if its already in `currentObject`, recursively
 */
const deepReplaceOrAddCurrentKeyValuesWithDesiredKeyValues = ({
  currentObject,
  desiredObject,
}: {
  currentObject: any;
  desiredObject: any;
}) => {
  // if either key is not an object, return the current object without doing anything - we found a normal value
  if (typeof currentObject !== 'object' || typeof desiredObject !== 'object')
    return currentObject;

  // if either input is null, return null; (special case of whats intended with the above since technically `null` _is_ typeof object)
  if (currentObject === null || desiredObject === null) return currentObject;

  // merge the keys
  const currentKeys = Object.keys(currentObject);
  const keysToAdd = Object.keys(desiredObject).filter(
    (desiredKey) => !currentKeys.includes(desiredKey),
  );
  const mergedKeys = [...currentKeys, ...keysToAdd]; // add the keys to the end

  // replace the value of each key in currentObject with the value in desiredObject, if exists in currentObject, deeply
  // using a for loop to ensure key order (no "parallelism", one at a time)
  const newObject: Record<string, any> = {};
  for (const thisKey of mergedKeys) {
    const currentValue = currentObject[thisKey];
    const desiredValue = desiredObject[thisKey];
    const newValue = (() => {
      // if current value is absent (undefined or null), we may add it to be the desired value
      if (currentValue === undefined || currentValue === null) {
        // but if .ifInstalled() modifier is present, skip absent deps (don't add them)
        if (
          typeof desiredValue === 'string' &&
          hasIfInstalledModifier(desiredValue)
        )
          return undefined;
        return desiredValue;
      }
      if (desiredValue === undefined) return currentValue; // if there is no value defined in the desired object for this key, then keep the current value
      if (Array.isArray(desiredValue)) return desiredValue; // TODO: think through if we should do something special here
      if (isCheckMinVersionExpression(desiredValue)) {
        const minVersion =
          getMinVersionFromCheckMinVersionExpression(desiredValue);
        if (!minVersion)
          throw new UnexpectedCodePathError(
            "checked that its a min version expression but couldn't extract a min version",
          ); // fail fast if weird error occurs
        const ifInstalled = hasIfInstalledModifier(desiredValue);
        const passesMinVersion = checkDoesFoundValuePassesMinVersionCheck({
          foundValue: currentValue,
          minVersion,
          ifInstalled,
        });
        if (passesMinVersion) return currentValue; // dont change the current version if it passes the check
        return minVersion; // return the minimum version if it doesn't pass the check
      }
      if (typeof desiredValue !== 'object') return desiredValue;
      if (desiredValue === null) return desiredValue;
      return deepReplaceOrAddCurrentKeyValuesWithDesiredKeyValues({
        currentObject: currentValue,
        desiredObject: desiredValue,
      });
    })();
    // skip keys that return undefined (e.g., .ifInstalled() with absent dep)
    if (newValue !== undefined) newObject[thisKey] = newValue;
  }

  // return the new object
  return newObject;
};

/**
 * fix contains json by replacing and adding key values
 * - replaces keys in place (order not change)
 * - adds keys to the end (note: folks should specify a check that checks order if it matters, and have that check fix things)
 * - omits self-deps to prevent circular dependency errors
 */
export const fixContainsJSONByReplacingAndAddingKeyValues: FileFixFunction =
  async (contents, context) => {
    // check that declared contents exist; if not, then we have no work to do
    const declaredContents = context.declaredFileContents;
    if (!declaredContents) return {}; // if no declared file contents, then we cant change anything

    // check that the file exists; if not, create from declared (with check expressions replaced)
    if (!contents)
      return {
        contents: context.declaredFileContents
          ? deepReplaceAllCheckExpressionsFromDeclaredContentsString({
              declaredContents,
            }) // replace the check expressions, if declaredFileContents
          : context.declaredFileContents,
      }; // if the file DNE

    // parse the contents
    const foundPackageJSON = parseJSON(contents);
    const declaredPackageJSON = parseJSON(declaredContents);

    // for package.json, process self-deps (omit or preserve link:./file:.)
    const isPackageJson = context.relativeFilePath === 'package.json';
    const targetPackageName = isPackageJson
      ? await getTargetPackageName(context)
      : null;
    const processedDeclaredJSON = targetPackageName
      ? processSelfDepsForFix({
          declared: declaredPackageJSON as Record<string, unknown>,
          found: foundPackageJSON as Record<string, unknown>,
          targetPackageName,
        })
      : declaredPackageJSON;

    // for each key in declared package json, replace the key if it exists in the found package
    const fixedPackageJSON =
      deepReplaceOrAddCurrentKeyValuesWithDesiredKeyValues({
        currentObject: foundPackageJSON,
        desiredObject: processedDeclaredJSON,
      });

    // and return the contents now
    return {
      contents: JSON.stringify(fixedPackageJSON, null, 2),
    };
  };
