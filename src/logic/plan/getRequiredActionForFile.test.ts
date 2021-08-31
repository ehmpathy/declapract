import {
  FileCheckDeclaration,
  FileCheckEvaluation,
  FileCheckType,
  FileEvaluationResult,
  FilePracticeEvaluation,
  PracticeDeclaration,
  RequiredAction,
} from '../../domain';
import { getRequiredActionForFile } from './getRequiredActionForFile';

describe('getRequiredActionForFile', () => {
  it('should find that if all the evaluations passed, the action is no change', () => {
    const action = getRequiredActionForFile({
      evaluations: [{ result: FileEvaluationResult.PASS } as FilePracticeEvaluation],
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
          checked: {
            badPractices: [],
            bestPractice: [
              {
                result: FileEvaluationResult.FAIL,
                path: '__path__',
                check: {
                  pathGlob: '__path_glob__',
                  type: FileCheckType.EQUALS,
                  required: true,
                  check: () => {},
                  fix: () => '__new_contents__', // fix is defined for the only check it has
                } as FileCheckDeclaration,
              } as FileCheckEvaluation,
            ],
          },
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
          checked: {
            badPractices: [],
            bestPractice: [
              {
                result: FileEvaluationResult.FAIL,
                path: '__path__',
                check: {
                  pathGlob: '__path_glob__',
                  type: FileCheckType.EQUALS,
                  required: true,
                  check: () => {},
                  fix: null, // fix is NOT defined for the only check it has
                } as FileCheckDeclaration,
              } as FileCheckEvaluation,
            ],
          },
        } as FilePracticeEvaluation,
      ],
    });
    expect(action).toEqual(RequiredAction.FIX_MANUAL);
  });
  it('should find that if an evaluation has failed a bad practice, the action is fix manual', () => {
    const action = getRequiredActionForFile({
      evaluations: [
        {
          result: FileEvaluationResult.FAIL,
          path: '__path__',
          practice: {} as PracticeDeclaration,
          checked: {
            badPractices: [{ result: FileEvaluationResult.PASS } as FileCheckEvaluation],
            bestPractice: [],
          },
        } as FilePracticeEvaluation,
      ],
    });
    expect(action).toEqual(RequiredAction.FIX_MANUAL);
  });
});
