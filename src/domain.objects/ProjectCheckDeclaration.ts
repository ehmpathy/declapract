import { DomainObject } from 'domain-objects';
import { z } from 'zod';

import { FileCheckDeclaration } from './FileCheckDeclaration';

const schema = z.object({
  name: z.string(),
  readme: z.string().nullable(),
  checks: z.array(FileCheckDeclaration.schema).min(1),
});

export interface ProjectCheckDeclaration {
  name: string;
  readme: string | null;
  checks: FileCheckDeclaration[];
}
export class ProjectCheckDeclaration
  extends DomainObject<ProjectCheckDeclaration>
  implements ProjectCheckDeclaration
{
  public static schema = schema;
}
