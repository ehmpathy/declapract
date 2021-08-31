import { Command, flags } from '@oclif/command';
import { plan } from '../../logic/commands/plan';

export default class Plan extends Command {
  public static description =
    'Check a software project against a declared use-case and report whether there are any actions that need to be taken to make it adhere to the declared practices of that use-case.';

  public static flags = {
    help: flags.help({ char: 'h' }),
    config: flags.string({
      char: 'c',
      description: 'path to the declapract usage config yml',
      required: true,
      default: 'declapract.use.yml',
    }),
  };

  public async run() {
    const { flags } = this.parse(Plan);
    const config = flags.config!;

    // generate the code
    const configPath = config.slice(0, 1) === '/' ? config : `${process.cwd()}/${config}`; // if starts with /, consider it as an absolute path
    await plan({ usePracticesConfigPath: configPath });
  }
}
