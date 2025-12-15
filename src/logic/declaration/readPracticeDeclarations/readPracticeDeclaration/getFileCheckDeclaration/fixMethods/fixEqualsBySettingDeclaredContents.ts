import type { FileFixFunction } from '@src/domain';

export const fixEqualsBySettingDeclaredContents: FileFixFunction = (
  _,
  context,
) => ({
  contents: context.declaredFileContents,
});
