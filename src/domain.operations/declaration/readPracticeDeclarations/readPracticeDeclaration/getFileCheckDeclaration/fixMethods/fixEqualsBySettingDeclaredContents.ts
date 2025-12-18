import type { FileFixFunction } from '@src/domain.objects';

export const fixEqualsBySettingDeclaredContents: FileFixFunction = (
  _,
  context,
) => ({
  contents: context.declaredFileContents,
});
