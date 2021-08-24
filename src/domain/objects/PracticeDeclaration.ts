import { DomainObject } from 'domain-objects';

import { CheckProjectDeclaration } from './CheckProjectDeclaration';

/**
 * defines a software practice that can be observed in a code base
 *
 * for example: 'never use `moment.js`' is a practice an org can adopt
 */
export interface PracticeDeclaration {
  name: string;
  bestPractice: CheckProjectDeclaration | null;
  badPractices: CheckProjectDeclaration[];
}
export class PracticeDeclaration extends DomainObject<PracticeDeclaration> implements PracticeDeclaration {}
