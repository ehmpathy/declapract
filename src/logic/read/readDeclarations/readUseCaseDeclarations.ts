import { PracticeDeclaration, UseCaseDeclaration } from '../../../domain';
import { ExampleDeclaration } from '../../../domain/objects/ExampleDeclaration';
import { UseCasesDeclarationInput } from '../../../domain/objects/UseCasesDeclarationInput';
import { readYmlFile } from '../../../utils/fileio/readYmlFile';
import { UserInputError } from '../../UserInputError';

export const readUseCaseDeclarations = async ({
  declaredUseCasesPath,
  practices,
}: {
  declaredUseCasesPath: string;
  practices: PracticeDeclaration[];
}) => {
  // try to read the file
  const useCasesYml = await readYmlFile({ filePath: declaredUseCasesPath });

  // read and validate the useCases yml file
  const useCasesInput = await (async () => {
    try {
      return new UseCasesDeclarationInput(useCasesYml);
    } catch (error) {
      throw new UserInputError('use-cases declaration file contents failed validation', {
        potentialSolution: error.message,
      });
    }
  })();

  // now build up the use cases
  const useCases = Object.entries(useCasesInput['use-cases']).map(
    ([name, definition]) =>
      new UseCaseDeclaration({
        name,
        practices: definition.practices.map((requestedPracticeName) => {
          const foundPractice = practices.find((practice) => practice.name === requestedPracticeName);
          if (!foundPractice)
            throw new UserInputError(
              `A use-case specified a practices that was not defined: 'use-case:${name}' specified 'practice:${requestedPracticeName}', but no practice with name '${requestedPracticeName}' has been defined`,
              {
                potentialSolution: 'Have you checked that there is not a typo in the practice name?',
              },
            );
          return foundPractice;
        }),
        example: definition.example ? new ExampleDeclaration({ name: definition.example }) : null,
      }),
  );

  // now hydrate the use cases that requested "extends" of another use case
  const hydratedUseCases = useCases.map((useCase) => {
    // determine whether this use case asked for an extension
    const { extends: extendsUseCaseName } = useCasesInput['use-cases'][useCase.name];
    if (!extendsUseCaseName) return useCase; // if it doesn't extend any use cases, then we can stop here

    // lookup the use case that it extends
    const extendedUseCase = useCases.find((candidateUseCase) => candidateUseCase.name === extendsUseCaseName);
    if (!extendedUseCase)
      throw new UserInputError(
        `A use-case was defined to extend a non-existent use-case. 'use-case:${useCase.name}' was defined to extend 'use-case:${extendsUseCaseName}', but no use case with name '${extendsUseCaseName}' is defined`,
        { potentialSolution: 'Was there a typo?' },
      );

    // now add the practices from the extended use case to the extendee use case
    return new UseCaseDeclaration({
      ...useCase,
      practices: [...extendedUseCase.practices, ...useCase.practices],
    });
  });

  // and return the use cases
  return hydratedUseCases;
};
