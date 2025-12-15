import type { ProjectVariablesImplementation } from '@src/domain';
import type { FileCheckContext } from '@src/domain/objects/FileCheckContext';
import { UnexpectedCodePathError } from '@src/logic/UnexpectedCodePathError';

/**
 * createGetVariables creates a function which you can use to access project variables in your check functions
 */
export const createGetVariables = <T extends ProjectVariablesImplementation>(
  example: T,
): ((context: FileCheckContext) => T) => {
  return (context: FileCheckContext) => {
    if (!context.projectVariables) {
      if (process.env.NODE_ENV === 'test') return example;
      throw new UnexpectedCodePathError(
        'project variables were not defined on context and it is not a test environment',
      );
    }
    return context.projectVariables as T;
  };
};
