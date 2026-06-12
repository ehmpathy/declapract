import { DomainObject } from 'domain-objects';
import type { PickAny } from 'type-fns';
import { z } from 'zod';

import type { ProjectVariablesImplementation } from '@src/domain.objects/constants';

import { DeclaredPractices } from './DeclaredPractices';

const schema = z.object({
  rootDir: z.string(), // dir of config file, to which all config paths are relative
  declared: DeclaredPractices.schema, // the declared practices to use
  scope: z.object({
    usecase: z.string().nullable(),
    practices: z.array(z.string()).optional(),
  }),
  variables: z.record(z.string(), z.unknown()), // specifies which variables to use
});

export interface ActionUsePracticesConfig {
  rootDir: string;
  declared: DeclaredPractices;
  scope: PickAny<{
    usecase: string | null;
    practices: string[];
  }>;
  variables: ProjectVariablesImplementation;
}
export class ActionUsePracticesConfig
  extends DomainObject<ActionUsePracticesConfig>
  implements ActionUsePracticesConfig
{
  public static schema = schema;
}
