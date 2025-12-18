import { FileCheckType } from '@src/domain.objects';
import type { FileCheckDeclarationInput } from '@src/domain.objects/FileCheckDeclarationInput';

export const check: FileCheckDeclarationInput = {
  type: FileCheckType.CONTAINS,
  optional: true,
}; // not all services have clients, but if they do, they should use the `simple-lambda-client` util
