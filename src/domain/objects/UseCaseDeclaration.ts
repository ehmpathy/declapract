import { DomainObject } from 'domain-objects';

import { PracticeDeclaration } from './PracticeDeclaration';

export interface UseCaseDeclaration {
  name: string;
  practices: PracticeDeclaration[];
}
export class UseCaseDeclaration extends DomainObject<UseCaseDeclaration> implements UseCaseDeclaration {}
