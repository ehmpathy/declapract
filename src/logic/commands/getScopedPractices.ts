import { UnexpectedCodePathError } from '@ehmpathy/error-fns';

import { ActionUsePracticesConfig } from '../../domain/objects/ActionUsePracticesConfig';

export const getDesiredPractices = ({
  config,
  filter,
}: {
  config: ActionUsePracticesConfig;
  filter?: {
    practiceNames?: string[];
    filePaths?: string[];
  };
}) => {
  // grab the selected use case's practices
  const usecase =
    config.declared.useCases.find(
      (thisUseCase) => thisUseCase.name === config.scope.usecase,
    ) ?? null;
  if (!usecase && config.scope.usecase)
    throw new UnexpectedCodePathError(
      'requested usecase was not declared on config',
      { usecase: config.scope.usecase },
    );

  // declare the practices
  const practicesChosen = [
    ...(usecase?.practices ?? []),
    ...(config.scope.practices ?? []).map(
      (practiceName) =>
        config.declared.practices.find(
          (practice) => practice.name === practiceName,
        ) ??
        UnexpectedCodePathError.throw(
          'requested practice was not declared on config',
          { practiceName },
        ),
    ),
  ];

  // filter the practices
  const practicesFiltered = practicesChosen.filter(
    (practice) =>
      filter?.practiceNames
        ? filter?.practiceNames.includes(practice.name) // if practice.name filter was defined, ensure practice.name is included
        : true, // otherwise, all are included
  );

  // return those
  return practicesFiltered;
};
