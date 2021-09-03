import { Command, flags } from '@oclif/command';
import { validate } from '../../logic/commands/validate';

export default class Validate extends Command {
  public static description =
    "validate the declared practices, use cases, and examples; checks that these declarations are usable and don't contain declaration errors";

  public static flags = {
    help: flags.help({ char: 'h' }),
    config: flags.string({
      char: 'c',
      description: 'path to the declapract declarations config yml',
      required: true,
      default: 'declapract.declare.yml',
    }),
  };

  public async run() {
    const { flags } = this.parse(Validate);
    const config = flags.config!;

    // generate the code
    const configPath = config.slice(0, 1) === '/' ? config : `${process.cwd()}/${config}`; // if starts with /, consider it as an absolute path
    await validate({
      declarePracticesConfigPath: configPath,
    });
  }
}
