import { FileCheckContext } from '../../../../../../domain';
import { replaceProjectVariablesInDeclaredFileContents } from './replaceProjectVariablesInDeclaredFileContents';

// define how to get the parsed declared contents
export const getParsedDeclaredContentsFromContext = (context: FileCheckContext) => {
  const projectVariables = context.projectVariables; // grab the project variables
  const declaredContentsPostVariableReplacement = context.declaredFileContents
    ? replaceProjectVariablesInDeclaredFileContents({
        projectVariables,
        fileContents: context.declaredFileContents,
      })
    : null;
  return declaredContentsPostVariableReplacement;
};
