import { createGetVariables } from '../../../declare/createGetVariables';

export const getServiceVariables = createGetVariables({
  organizationName: 'awesum',
  serviceName: 'svc-awesome-thing',
  infrastructureNamespaceId: 'abcde12345',
  slackReleaseWebHook: 'https://...',
});
