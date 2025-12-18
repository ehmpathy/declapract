import {
  checkDoesFoundValuePassesMinVersionCheck,
  getMinVersionFromCheckMinVersionExpression,
  isCheckMinVersionExpression,
} from '@src/domain.operations/declaration/readPracticeDeclarations/readPracticeDeclaration/getFileCheckDeclaration/checkExpressions/check.minVersion';
import { UnexpectedCodePathError } from '@src/domain.operations/UnexpectedCodePathError';
import { parseJSON } from '@src/utils/json/parseJSON';

import { checkContainsSubstring } from './checkContainsSubstring';

/**
 * the function that evaluates the "min version" json check expressions
 *
 * e.g., `@declapract{check.minVersion('4.0.0')}` => apply the regexp checking min version of '4.0.0'
 */
const evaluateSupportedJSONCheckExpressionMinimumVersion = ({
  declaredValue,
  foundValue,
}: {
  declaredValue: string;
  foundValue: any;
}) => {
  // grab the min version expected from the declared value check expression
  const minVersion = getMinVersionFromCheckMinVersionExpression(declaredValue);
  if (!minVersion)
    throw new UnexpectedCodePathError(
      'JSONCheckExpressionMinimumVersion attempted to be evaluated, but no minVersion could be declared from check expression declaration',
      { declaredValue },
    );

  // check whether it passes
  const passesMinVersionCheck = checkDoesFoundValuePassesMinVersionCheck({
    foundValue,
    minVersion,
  });

  // if foundValue does not match it, return the error message
  if (!passesMinVersionCheck)
    return `a version greater than or equal to '${minVersion}'`;

  // if it does match it, then return the value we found (so that there's no diff due to this one)
  return foundValue;
};

/**
 * a function which recursively evaluates the declaredContents.
 *
 * returns:
 * - the declared value, if not a supported check expression
 * - the found value, if successfully evaluated against the check expression
 * - an error string, if failed evaluating against a check expression
 *
 * why?: in order to evaluate each of the check expressions we support and display them in an easy to read diff
 */
const recursivelyEvaluateDeclaredContentsToCheckContains = ({
  declared,
  found,
}: {
  declared: any;
  found: any;
}) => {
  // sanity check that there's anything to do
  if (!declared || typeof declared !== 'object') return declared; // nothing to eval, if declared is not an object
  if (!found || typeof found !== 'object') return declared; // nothing to eval, if found is not an object

  // start tracking the object that we'll record evaluated values in
  const declaredToCheckContains: Record<string, any> = {};

  // evaluate each key one at a time, to preserve order
  const keysToEvaluate = Object.keys(declared);
  for (const key of keysToEvaluate) {
    const declaredValue = declared[key];
    const foundValue = found[key];

    // evaluate the value; replace if needed
    const evaluatedValue = (() => {
      // handle case where declared value is falsy
      if (!declaredValue) return declaredValue;

      // handle cases where the declared value is itself an object (i.e., go one layer deeper, recursively)
      if (typeof declaredValue === 'object')
        return recursivelyEvaluateDeclaredContentsToCheckContains({
          declared: declaredValue,
          found: foundValue,
        });

      // handle cases where the declared value is a check reference to evaluate
      if (
        typeof declaredValue === 'string' &&
        declaredValue.startsWith('@declapract{check.')
      ) {
        if (isCheckMinVersionExpression(declaredValue)) {
          const evaluatedValue =
            evaluateSupportedJSONCheckExpressionMinimumVersion({
              declaredValue,
              foundValue,
            });
          return evaluatedValue;
        }
      }

      // if did not match any of the above, then its just the declared value still
      return declaredValue;
    })();

    // set the evaluated value in the declaredToCheckContains object
    declaredToCheckContains[key] = evaluatedValue;
  }

  // return the declared to check contains object
  return declaredToCheckContains;
};

/**
 * a function which recursively filters down the found contents to the ones that were specified as relevant by the declared contents.
 */
const recursivelyFilterFoundContentsToCheckContains = ({
  declared,
  found,
}: {
  declared: any;
  found: any;
}) => {
  // sanity check that there's anything to do
  if (!declared || typeof declared !== 'object') return {}; // nothing to compare against, if declared is not an object
  if (!found || typeof found !== 'object') return found; // nothing to filter, if found is not an object

  // start tracking the object that we'll record evaluated values in
  const foundToCheckContains: Record<string, any> = {};

  // evaluate each key one at a time, to preserve order
  const keysToFilter = Object.keys(declared);
  for (const key of keysToFilter) {
    const declaredValue = declared[key];
    const foundValue = found[key];

    // evaluate the value; replace if needed
    const filteredValue = (() => {
      // handle case where declared value is falsy
      if (!declaredValue) return foundValue;

      // handle cases where the declared value is itself an object (i.e., go one layer deeper, recursively)
      if (typeof declaredValue === 'object')
        return recursivelyFilterFoundContentsToCheckContains({
          declared: declaredValue,
          found: foundValue,
        });

      // if did not match any of the above, then its just the declared value still
      return foundValue;
    })();

    // set the evaluated value in the declaredToCheckContains object
    foundToCheckContains[key] = filteredValue;
  }

  // return the declared to check contains object
  return foundToCheckContains;
};

export const checkContainsJSON = ({
  declaredContents,
  foundContents,
}: {
  declaredContents: string;
  foundContents: string;
}) => {
  // json parse the contents
  const parsedDeclaredContents = parseJSON(declaredContents);
  const parsedFoundContents = parseJSON(foundContents);

  // define the "declaredContentsToCheckContains" and "foundContentsToCheckContains" by evaluating any "@declapract{check.}" expressions and excluding any irrelevant keys, recursively
  const declaredContentsToCheckContains =
    recursivelyEvaluateDeclaredContentsToCheckContains({
      declared: parsedDeclaredContents,
      found: parsedFoundContents,
    });
  const foundContentsToCheckContains =
    recursivelyFilterFoundContentsToCheckContains({
      declared: parsedDeclaredContents,
      found: parsedFoundContents,
    });

  // and do the contains substring check on those two strings now, to show diff better
  checkContainsSubstring({
    declaredContents: JSON.stringify(declaredContentsToCheckContains, null, 2),
    foundContents: JSON.stringify(foundContentsToCheckContains, null, 2),
    bAnnotation: 'Received relevantKeys',
  });
};
