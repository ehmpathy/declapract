import { rm } from 'fs/promises';

export const removeDirectoryAsync = ({ directory }: { directory: string }) =>
  rm(directory, { recursive: true, force: true });
