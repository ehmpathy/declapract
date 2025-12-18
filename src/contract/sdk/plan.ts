import { plan } from '@src/domain.operations/commands/plan';

export const executePlan = async (options: {
  config: string;
  practice?: string;
  file?: string;
}): Promise<void> => {
  const configPath =
    options.config.slice(0, 1) === '/'
      ? options.config
      : `${process.cwd()}/${options.config}`;

  await plan({
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
