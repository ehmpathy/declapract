import type { FileCheckContext, FileCheckFunction } from '@src/domain';

export const withOptionalityCheck = (
  logic: FileCheckFunction,
): FileCheckFunction => {
  return async (foundContents: string | null, context: FileCheckContext) => {
    if (!context.required && foundContents === null) return; // if this file is optional, then just return here
    await logic(foundContents, context);
  };
};
