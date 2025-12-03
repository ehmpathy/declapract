import type { FileFixFunction } from '../../../../../../domain';

export const fixEqualsBySettingDeclaredContents: FileFixFunction = (
  _,
  context,
) => ({
  contents: context.declaredFileContents,
});
