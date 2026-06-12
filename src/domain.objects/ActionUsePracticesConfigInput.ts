import { DomainObject } from 'domain-objects';
import type { PickAny } from 'type-fns';
import { z } from 'zod';

const schema = z.object({
  declarations: z.string(), // either an ssh path to a git repo - or a file path to a local directory
  useCase: z.string().optional(), // specifies which use case to use
  scope: z
    .object({
      usecase: z.string().optional(),
      practices: z.array(z.string()).optional(),
    })
    .optional(),
  variables: z.record(z.string(), z.unknown()).optional(), // specifies which variables to use
});

export interface ActionUsePracticesConfigInput {
  declarations: string;
  useCase?: string;
  scope?: PickAny<{
    usecase: string;
    practices: string[];
  }>;
  variables?: Record<string, any>;
}
export class ActionUsePracticesConfigInput
  extends DomainObject<ActionUsePracticesConfigInput>
  implements ActionUsePracticesConfigInput
{
  public static schema = schema;
}
