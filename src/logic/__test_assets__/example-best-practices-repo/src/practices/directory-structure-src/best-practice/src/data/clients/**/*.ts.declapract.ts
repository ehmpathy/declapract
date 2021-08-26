import { FileCheckType } from '../../../../../../../../../../../domain';
import { CheckFileDeclarationInput } from '../../../../../../../../../../../domain/objects/CheckFileDeclarationInput';

export const check: CheckFileDeclarationInput = { type: FileCheckType.CONTAINS, optional: true }; // not all services have clients, but if they do, they should use the `simple-lambda-client` util
