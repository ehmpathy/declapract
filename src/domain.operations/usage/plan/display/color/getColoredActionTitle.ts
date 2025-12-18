import chalk from 'chalk';

export const getColoredActionTitle = ({
  actionToken,
  relativeFilePath,
}: {
  actionToken: string;
  relativeFilePath: string;
}) => {
  // define the header
  const title = chalk.bold(`${actionToken} ${relativeFilePath}`);

  // return header
  return title;
};
