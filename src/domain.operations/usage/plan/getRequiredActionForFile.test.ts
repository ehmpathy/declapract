import {
  type FileCheckEvaluation,
  FileCheckPurpose,
  FileEvaluationResult,
  type FileFixFunction,
  type FilePracticeEvaluation,
  type PracticeDeclaration,
  RequiredAction,
} from '@src/domain.objects';

import { getRequiredActionForFile } from './getRequiredActionForFile';

describe('getRequiredActionForFile', () => {
  it('should find that if all the evaluations passed, the action is no change', () => {
    const action = getRequiredActionForFile({
      evaluations: [
        { result: FileEvaluationResult.PASS } as FilePracticeEvaluation,
      ],
    });
    expect(action).toEqual(RequiredAction.NO_CHANGE);
  });
  it('should find that if an evaluation has failed a fixable best practice, the action is fix automatic', () => {
    const action = getRequiredActionForFile({
      evaluations: [
        {
          result: FileEvaluationResult.FAIL,
          path: '__path__',
          practice: {} as PracticeDeclaration,
          checks: [
            {
              purpose: FileCheckPurpose.BEST_PRACTICE,
              result: FileEvaluationResult.FAIL,
              path: '__path__',
              fix: (() => '__new_contents__') as FileFixFunction, // fix is defined for the only check it has
            } as FileCheckEvaluation,
          ],
        } as FilePracticeEvaluation,
      ],
    });
    expect(action).toEqual(RequiredAction.FIX_AUTOMATIC);
  });
  it('should find that if an evaluation has failed a non-fixable best practice, the action is fix manual', () => {
    const action = getRequiredActionForFile({
      evaluations: [
        {
          result: FileEvaluationResult.FAIL,
          path: '__path__',
          practice: {} as PracticeDeclaration,
          checks: [
            {
              purpose: FileCheckPurpose.BEST_PRACTICE,
              result: FileEvaluationResult.FAIL,
              path: '__path__',
              fix: null, // fix is NOT defined for the only check it has
            } as FileCheckEvaluation,
          ],
        } as FilePracticeEvaluation,
      ],
    });
    expect(action).toEqual(RequiredAction.FIX_MANUAL);
  });
  it('should find that if an evaluation has failed a fixable bad practice, the action is fix automatic', () => {
    const action = getRequiredActionForFile({
      evaluations: [
        {
          result: FileEvaluationResult.FAIL,
          path: '__path__',
          practice: {} as PracticeDeclaration,
          checks: [
            {
              purpose: FileCheckPurpose.BAD_PRACTICE,
              result: FileEvaluationResult.FAIL,
              path: '__path__',
              fix: (() => '__new_contents__') as FileFixFunction, // fix is defined for the only check it has
            } as FileCheckEvaluation,
          ],
        } as FilePracticeEvaluation,
      ],
    });
    expect(action).toEqual(RequiredAction.FIX_AUTOMATIC);
  });
  it('should find that if an evaluation has failed a non-fixable bad practice, the action is fix manual', () => {
    const action = getRequiredActionForFile({
      evaluations: [
        {
          result: FileEvaluationResult.FAIL,
          path: '__path__',
          practice: {} as PracticeDeclaration,
          checks: [
            {
              purpose: FileCheckPurpose.BAD_PRACTICE,
              result: FileEvaluationResult.FAIL,
              path: '__path__',
              fix: null, // fix is NOT defined for the only check it has
            } as FileCheckEvaluation,
          ],
        } as FilePracticeEvaluation,
      ],
    });
    expect(action).toEqual(RequiredAction.FIX_MANUAL);
  });
});
