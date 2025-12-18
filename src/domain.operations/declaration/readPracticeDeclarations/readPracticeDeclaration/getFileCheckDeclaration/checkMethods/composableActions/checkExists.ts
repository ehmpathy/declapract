import chalk from 'chalk';

export const checkExists = (foundContents: string | null) => {
  if (!foundContents)
    throw new Error(
      [
        chalk.green('- Expected file to exist'),
        chalk.red('+ Received file does not exist'),
      ].join('\n'),
    );
};
