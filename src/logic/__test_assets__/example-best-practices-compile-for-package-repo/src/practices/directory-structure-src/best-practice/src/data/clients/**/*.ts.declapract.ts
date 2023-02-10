import { FileCheckType } from '../../../../../../../../../../../domain';
import { FileCheckDeclarationInput } from '../../../../../../../../../../../domain/objects/FileCheckDeclarationInput';

export const check: FileCheckDeclarationInput = {
  type: FileCheckType.CONTAINS,
  optional: true,
}; // not all services have clients, but if they do, they should use the `simple-lambda-client` util
