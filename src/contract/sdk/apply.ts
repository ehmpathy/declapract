import { apply } from '../../logic/commands/apply';

export const executeApply = async (options: {
  config: string;
  practice?: string;
  file?: string;
}): Promise<void> => {
  const configPath =
    options.config.slice(0, 1) === '/'
      ? options.config
      : `${process.cwd()}/${options.config}`;

  await apply({
    usePracticesConfigPath: configPath,
    filter:
      options.practice || options.file
        ? {
            practiceNames: options.practice ? [options.practice] : undefined,
            filePaths: options.file ? [options.file] : undefined,
          }
        : undefined,
  });
};
