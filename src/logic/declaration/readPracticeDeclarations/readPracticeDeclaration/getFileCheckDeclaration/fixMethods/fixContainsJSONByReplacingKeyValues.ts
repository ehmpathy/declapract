import { FileFixFunction } from '../../../../../../domain';
import { UnexpectedCodePathError } from '../../../../../UnexpectedCodePathError';
import {
  checkDoesFoundValuePassesMinVersionCheck,
  getMinVersionFromCheckMinVersionExpression,
  isCheckMinVersionExpression,
} from '../checkExpressions/check.minVersion';

/**
 * e.g., replace a `@declapract{check.minVersion('..')}` strings in the declared contents
 *
 * typically used to create a new file from declarations
 */
const deepReplaceAllCheckExpressionsFromDeclaredContentsString = ({
  declaredContents,
}: {
  declaredContents: string;
}) => {
  return declaredContents.replace(/\@declapract\{check\.minVersion\('([0-9\.]+)'\)\}/g, '$1'); // using regexp capture groups to simplify this for now since we only have the minVersion expression; // TODO: make this more generic to handle other check expression types
};

/**
 * replaces the value of each key in `currentObject` with the value of that key in `desiredObject`, if its in `desiredObject`, recursively
 */
const deepReplaceCurrentKeyValuesWithDesiredKeyValues = ({
  currentObject,
  desiredObject,
}: {
  currentObject: any;
  desiredObject: any;
}) => {
  // if either key is not an object, return the current object without doing anything - we found a normal value
  if (typeof currentObject !== 'object' || typeof desiredObject !== 'object') return currentObject;

  // if either input is null, return null; (special case of whats intended with the above since technically `null` _is_ typeof object)
  if (currentObject === null || desiredObject === null) return currentObject;

  // replace the value of each key in currentObject with the value in desiredObject, if exists in desiredObject, deeply
  // using a for loop to ensure key order (no "parallelism", one at a time)
  const newObject: Record<string, any> = {};
  for (const thisKey of Object.keys(currentObject)) {
    const currentValue = currentObject[thisKey];
    const desiredValue = desiredObject[thisKey];
    const newValue = (() => {
      if (!desiredValue) return currentValue; // if there is no value defined in the desired object for this key, then return the current value
      if (Array.isArray(desiredValue)) return desiredValue; // TODO: think through if we should do something special here
      if (isCheckMinVersionExpression(desiredValue)) {
        const minVersion = getMinVersionFromCheckMinVersionExpression(desiredValue);
        if (!minVersion)
          throw new UnexpectedCodePathError(
            "checked that its a min version expression but couldn't extract a min version",
          ); // fail fast if weird error occurs
        const passesMinVersion = checkDoesFoundValuePassesMinVersionCheck({ foundValue: currentValue, minVersion });
        if (passesMinVersion) return currentValue; // dont change the current version if it passes the check
        return minVersion; // return the minimum version if it doesn't pass the check
      }
      if (typeof desiredValue !== 'object') return desiredValue;
      if (desiredValue === null) return desiredValue;
      return deepReplaceCurrentKeyValuesWithDesiredKeyValues({
        currentObject: currentValue,
        desiredObject: desiredValue,
      });
    })();
    newObject[thisKey] = newValue;
  }

  // return the new object
  return newObject;
};

export const fixContainsJSONByReplacingKeyValues: FileFixFunction = (contents, context) => {
  if (!contents)
    return {
      contents: context.declaredFileContents
        ? deepReplaceAllCheckExpressionsFromDeclaredContentsString({ declaredContents: context.declaredFileContents }) // replace the check expressions, if declaredFileContents
        : context.declaredFileContents,
    }; // if the file DNE
  if (!context.declaredFileContents) return {}; // if no declared file contents, then we cant change anything
  const foundPackageJSON = JSON.parse(contents);
  const declaredPackageJSON = JSON.parse(context.declaredFileContents);

  // for each key in declared package json, replace the key if it exists in the found package json
  const fixedPackageJSON = deepReplaceCurrentKeyValuesWithDesiredKeyValues({
    currentObject: foundPackageJSON,
    desiredObject: declaredPackageJSON,
  });

  // and return the contents now
  return {
    contents: JSON.stringify(fixedPackageJSON, null, 2),
  };
};
