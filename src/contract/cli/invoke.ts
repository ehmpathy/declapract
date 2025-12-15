import { Command } from 'commander';
import { readFileSync } from 'fs';
import { join } from 'path';

import { executeApply } from '@src/contract/sdk/apply';
import { executeCompile } from '@src/contract/sdk/compile';
import { executePlan } from '@src/contract/sdk/plan';
import { executeValidate } from '@src/contract/sdk/validate';

const getVersion = (): string => {
  const packageJson = JSON.parse(
    readFileSync(join(__dirname, '../../../package.json'), 'utf-8'),
  );
  return packageJson.version;
};

export const invoke = async ({ args }: { args: string[] }): Promise<void> => {
  const program = new Command();

  program
    .name('declapract')
    .description(
      'A tool to declaratively define best practices, maintainable evolve them, and scalably enforce them.',
    )
    .version(getVersion());

  program
    .command('plan')
    .description(
      'Plan and display what actions need to be taken in order to make a software project adhere to its declared practices.',
    )
    .option(
      '-c, --config <path>',
      'path to the declapract usage config yml',
      'declapract.use.yml',
    )
    .option(
      '-p, --practice <name>',
      'the name of a specific practice you want to scope checking for',
    )
    .option(
      '-f, --file <path>',
      'the file path of a specific file you want to scope checking for',
    )
    .action(
      async (options: { config: string; practice?: string; file?: string }) => {
        try {
          await executePlan(options);
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
      },
    );

  program
    .command('apply')
    .description(
      "Apply fixes to all files which have failed to adhere to any of the project's declared practices and have an automatic fix available.",
    )
    .option(
      '-c, --config <path>',
      'path to the declapract usage config yml',
      'declapract.use.yml',
    )
    .option(
      '-p, --practice <name>',
      'the name of a specific practice you want to scope checking for',
    )
    .option(
      '-f, --file <path>',
      'the file path of a specific file you want to scope checking for',
    )
    .action(
      async (options: { config: string; practice?: string; file?: string }) => {
        try {
          await executeApply(options);
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
      },
    );

  program
    .command('validate')
    .description(
      "Validate the declared practices, use cases, and examples; checks that these declarations are usable and don't contain declaration errors.",
    )
    .option(
      '-c, --config <path>',
      'path to the declapract declarations config yml',
      'declapract.declare.yml',
    )
    .action(async (options: { config: string }) => {
      try {
        await executeValidate(options);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    });

  program
    .command('compile')
    .description(
      'Compile the declared declarations so that they can be packaged and distributed by npm safely.',
    )
    .option(
      '-s, --source-directory <path>',
      'the source directory which contains the declarations to compile',
      'src',
    )
    .option(
      '-d, --distribution-directory <path>',
      'the distribution directory to which we will compile the declarations',
      'dist',
    )
    .action(
      async (options: {
        sourceDirectory: string;
        distributionDirectory: string;
      }) => {
        try {
          await executeCompile(options);
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
      },
    );

  await program.parseAsync(args, { from: 'user' });
};
