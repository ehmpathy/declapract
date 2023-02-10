import { Command, Flags } from '@oclif/core';

import { compile } from '../../logic/commands/compile';

// eslint-disable-next-line import/no-default-export
export default class Compile extends Command {
  public static description =
    'compile the declared declarations so that they can be packaged and distributed by npm safely';

  public static flags = {
    help: Flags.help({ char: 'h' }),
    sourceDirectory: Flags.string({
      char: 's',
      description:
        'the source directory which contains the declarations to compile',
      required: true,
      default: 'src',
    }),
    distributionDirectory: Flags.string({
      char: 'd',
      description:
        'the distribution directory to which we will compile the declarations',
      required: true,
      default: 'dist',
    }),
  };

  public async run() {
    const { flags } = await this.parse(Compile);
    const sourceDirectory = flags.sourceDirectory!;
    const distributionDirectory = flags.distributionDirectory;

    // generate the code
    const sourceDirectoryAbsolute =
      sourceDirectory.slice(0, 1) === '/'
        ? sourceDirectory
        : `${process.cwd()}/${sourceDirectory}`; // if starts with /, consider it as an absolute path
    const distributionDirectoryAbsolute =
      distributionDirectory.slice(0, 1) === '/'
        ? distributionDirectory
        : `${process.cwd()}/${distributionDirectory}`; // if starts with /, consider it as an absolute path
    await compile({
      sourceDirectory: sourceDirectoryAbsolute,
      distributionDirectory: distributionDirectoryAbsolute,
    });
  }
}
