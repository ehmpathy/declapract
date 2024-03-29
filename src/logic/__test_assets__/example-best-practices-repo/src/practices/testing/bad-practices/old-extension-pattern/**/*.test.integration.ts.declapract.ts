import {
  FileCheckType,
  FileFixFunction,
} from '../../../../../../../../../domain';

export const check = FileCheckType.EXISTS; // if files matching this pattern exist, bad practice

export const fix: FileFixFunction = (contents, context) => ({
  relativeFilePath: context.relativeFilePath.replace(
    /\.test\.integration\.ts$/,
    '.integration.test.ts',
  ),
  contents,
});
