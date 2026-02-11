import { FileCheckType } from '@src/domain.objects';

// files in nested hidden directories should be matched
export const check = FileCheckType.EXISTS;
