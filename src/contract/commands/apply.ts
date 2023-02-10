import { Command, Flags } from '@oclif/core';

import { apply } from '../../logic/commands/apply';

// eslint-disable-next-line import/no-default-export
export default class Apply extends Command {
  public static description =
    "apply fixes to all files which have failed to adhere to any of the project's declared practices and have an automatic fix available.";

  public static flags = {
    help: Flags.help({ char: 'h' }),
    config: Flags.string({
      char: 'c',
      description: 'path to the declapract usage config yml',
      required: true,
      default: 'declapract.use.yml',
    }),
    practice: Flags.string({
      char: 'p',
      description:
        'the name of a specific practice you want to scope checking for',
    }),
    file: Flags.string({
      char: 'f',
      description:
        'the file path of a specific file you want to scope checking for',
    }),
  };

  public async run() {
    const { flags } = await this.parse(Apply);
    const config = flags.config!;

    // generate the code
    const configPath =
      config.slice(0, 1) === '/' ? config : `${process.cwd()}/${config}`; // if starts with /, consider it as an absolute path
    await apply({
      usePracticesConfigPath: configPath,
      filter:
        flags.practice || flags.file
          ? {
              practiceNames: flags.practice ? [flags.practice] : undefined,
              filePaths: flags.file ? [flags.file] : undefined,
            }
          : undefined,
    });
  }
}
