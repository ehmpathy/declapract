import { ProjectVariablesImplementation } from '../../domain';
import { replaceAll } from '../../utils/stringPolyfill/replaceAll';
import { UnexpectedCodePathError } from '../UnexpectedCodePathError';
import { UserInputError } from '../UserInputError';

export const replaceProjectVariablesInDeclaredFileContents = ({
  projectVariables,
  fileContents,
}: {
  projectVariables: ProjectVariablesImplementation;
  fileContents: string;
}) => {
  // find the variables declared in the file contents
  const uniqueDeclaredVariableExpressions = [
    ...new Set(Array.from(fileContents.matchAll(new RegExp(/\@declapract\{variable\.\w+\}/g)), (m) => m[0])),
  ];

  // lookup each one and replace it (or throw an error if the variable was not defined)
  const replacedFileContents = uniqueDeclaredVariableExpressions.reduce((contents, thisVariableExpression) => {
    const variableKey = (new RegExp(/@declapract\{variable\.(\w+)\}/).exec(thisVariableExpression) ?? [])[1];
    if (!variableKey)
      throw new UnexpectedCodePathError(
        `could not extract variableKey from variableExpression '${thisVariableExpression}'`,
      );
    const variableValue = projectVariables[variableKey];
    if (!variableValue)
      throw new UserInputError(
        `variable was declared in file contents but its value was not defined: '${variableKey}' (declared by '${thisVariableExpression}')`,
        {
          potentialSolution:
            'Please either remove the reference to this variable or define its value in your projects variables (e.g., in `declapract.use.yml`)',
        },
      );
    return replaceAll(contents, thisVariableExpression, variableValue);
  }, fileContents);

  // and return the replaced contents
  return replacedFileContents;
};
