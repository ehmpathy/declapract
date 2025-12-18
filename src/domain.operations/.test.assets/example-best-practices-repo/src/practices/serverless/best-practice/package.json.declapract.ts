import expect from 'expect';

import { defineMinPackageVersionRegex } from '@src/contract';
import type { FileCheckContext } from '@src/domain.objects/FileCheckContext';
import { getProjectVariables } from '@src/domain.operations/.test.assets/example-best-practices-repo/src/getVariables';

export const check = async (
  contents: string | null,
  context: FileCheckContext,
) => {
  const { organizationName, slackReleaseWebHook } =
    getProjectVariables(context);
  expect(JSON.parse(contents ?? '')).toEqual(
    expect.objectContaining({
      devDependencies: expect.objectContaining({
        serverless: expect.stringMatching(
          defineMinPackageVersionRegex('2.50.0'),
        ),
      }),
      scripts: expect.objectContaining({
        'deploy:release': 'npm run build && sls deploy -v -s $SERVERLESS_STAGE',
        'deploy:send-notification': `curl -X POST -H 'Content-type: application/json' --data "{\\"text\\":\\"$([ -z $DEPLOYER_NAME ] && git config user.name || echo $DEPLOYER_NAME) has deployed $npm_package_name@v$npm_package_version:\nhttps://github.com/${organizationName}/$npm_package_name/tree/v$npm_package_version\\"}" ${slackReleaseWebHook}`,
        'deploy:dev': 'SERVERLESS_STAGE=dev npm run deploy:release',
        'deploy:prod':
          'SERVERLESS_STAGE=prod npm run deploy:release && npm run deploy:send-notification',
      }),
    }),
  );
};
