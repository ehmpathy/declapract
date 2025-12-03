import uniqBy from 'lodash.uniqby';

import { type PracticeDeclaration, UseCaseDeclaration } from '../../../domain';
import type { ExampleDeclaration } from '../../../domain/objects/ExampleDeclaration';
import { UseCasesDeclarationInput } from '../../../domain/objects/UseCasesDeclarationInput';
import { readYmlFile } from '../../../utils/fileio/readYmlFile';
import { UserInputError } from '../../UserInputError';

export const readUseCaseDeclarations = async ({
  declaredUseCasesPath,
  practices,
  examples,
}: {
  declaredUseCasesPath: string;
  practices: PracticeDeclaration[];
  examples: ExampleDeclaration[];
}) => {
  // try to read the file
  const useCasesYml = await readYmlFile({ filePath: declaredUseCasesPath });

  // read and validate the useCases yml file
  const useCasesInput = await (async () => {
    try {
      return new UseCasesDeclarationInput(useCasesYml);
    } catch (error) {
      throw new UserInputError(
        'use-cases declaration file contents failed validation',
        {
          potentialSolution: error.message,
        },
      );
    }
  })();

  // now build up the use cases
  const useCases = Object.entries(useCasesInput['use-cases']).map(
    ([name, definition]) =>
      new UseCaseDeclaration({
        name,
        practices: definition.practices.map((requestedPracticeName) => {
          const foundPractice = practices.find(
            (practice) => practice.name === requestedPracticeName,
          );
          if (!foundPractice)
            throw new UserInputError(
              `A use-case specified a practices that was not defined. 'use-case:${name}' specified 'practice:${requestedPracticeName}', but no practice with name '${requestedPracticeName}' has been defined`,
              {
                potentialSolution:
                  'Have you checked that there is not a typo in the practice name?',
              },
            );
          return foundPractice;
        }),
        example: definition.example
          ? (() => {
              const example = examples.find(
                (thisExample) => thisExample.name === definition.example,
              );
              if (!example)
                throw new UserInputError(
                  `example declared for use case but no example with this name was declared: '${definition.example}'`,
                );
              return example;
            })()
          : null,
      }),
  );

  // now hydrate the use cases that requested "extends" of another use case
  const hydratedUseCases = useCases.map((useCase) => {
    // determine whether this use case asked for an extension
    const { extends: extendsUseCaseNames } =
      useCasesInput['use-cases'][useCase.name]!;
    if (!extendsUseCaseNames) return useCase; // if it doesn't extend any use cases, then we can stop here

    // for each use case it extends and build up the full, hydrated set of practices
    const hydratedPractices = [...useCase.practices];
    extendsUseCaseNames.forEach((extendsUseCaseName) => {
      // lookup the use case that it extends
      const extendedUseCase = useCases.find(
        (candidateUseCase) => candidateUseCase.name === extendsUseCaseName,
      );
      if (!extendedUseCase)
        throw new UserInputError(
          `A use-case was defined to extend a non-existent use-case. 'use-case:${useCase.name}' was defined to extend 'use-case:${extendsUseCaseName}', but no use case with name '${extendsUseCaseName}' is defined`,
          { potentialSolution: 'Was there a typo?' },
        );

      // push the practices on that extended use case
      hydratedPractices.push(...extendedUseCase.practices);
    });

    // now dedupe them by name
    const uniqueHydratedPractices = uniqBy(
      hydratedPractices,
      (practice) => practice.name,
    );

    // and return the hydrated use case
    return new UseCaseDeclaration({
      ...useCase,
      practices: uniqueHydratedPractices,
    });
  });

  // and return the use cases
  return hydratedUseCases;
};
