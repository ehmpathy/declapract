import { compile } from '@src/domain.operations/commands/compile';

export const executeCompile = async (options: {
  sourceDirectory: string;
  distributionDirectory: string;
}): Promise<void> => {
  const sourceDirectoryAbsolute =
    options.sourceDirectory.slice(0, 1) === '/'
      ? options.sourceDirectory
      : `${process.cwd()}/${options.sourceDirectory}`;

  const distributionDirectoryAbsolute =
    options.distributionDirectory.slice(0, 1) === '/'
      ? options.distributionDirectory
      : `${process.cwd()}/${options.distributionDirectory}`;

  await compile({
    sourceDirectory: sourceDirectoryAbsolute,
    distributionDirectory: distributionDirectoryAbsolute,
  });
};
