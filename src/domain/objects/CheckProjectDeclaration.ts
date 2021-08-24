import { DomainObject } from 'domain-objects';
import { CheckFileDeclaration } from './CheckFileDeclaration';

export interface CheckProjectDeclaration {
  name: string;
  dir: string;
  readme: string | null;
  checks: CheckFileDeclaration[];
}
export class CheckProjectDeclaration extends DomainObject<CheckProjectDeclaration> implements CheckProjectDeclaration {}
