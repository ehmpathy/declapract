import { createGetVariables } from '../../../declaration/publicFileCheckFunctionUtilities/createGetVariables';

export const getProjectVariables = createGetVariables({
  organizationName: 'awesum',
  serviceName: 'svc-awesome-thing',
  infrastructureNamespaceId: 'abcde12345',
  slackReleaseWebHook: 'https://...',
});
