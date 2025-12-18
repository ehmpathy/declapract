import { validate } from '@src/domain.operations/commands/validate';

export const executeValidate = async (options: {
  config: string;
}): Promise<void> => {
  const configPath =
    options.config.slice(0, 1) === '/'
      ? options.config
      : `${process.cwd()}/${options.config}`;

  await validate({
    declarePracticesConfigPath: configPath,
  });
};
