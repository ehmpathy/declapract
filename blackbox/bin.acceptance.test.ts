import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { given, then, when } from 'test-fns';

const binPath = path.join(__dirname, '..', 'bin', 'run');
const rootDir = path.join(__dirname, '..');

describe('bin/run', () => {
  given('the cli bin', () => {
    when('invoked with --help', () => {
      then('it should output help text', () => {
        const output = execSync(`node ${binPath} --help`, {
          encoding: 'utf-8',
        });
        expect(output).toContain('declapract');
        expect(output).toContain('plan');
        expect(output).toContain('apply');
      });
    });

    when('invoked with --version', () => {
      then('it should output version', () => {
        const output = execSync(`node ${binPath} --version`, {
          encoding: 'utf-8',
        });
        expect(output).toMatch(/\d+\.\d+\.\d+/);
      });
    });
  });

  given('a project with declapract-typescript-ehmpathy', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'declapract-test-'));

    beforeAll(() => {
      // setup package.json with declapract peer dep linked to local build
      // tsx is needed because bin/run re-execs with --import tsx/esm
      fs.writeFileSync(
        path.join(tmpDir, 'package.json'),
        JSON.stringify(
          {
            name: 'test-project',
            version: '1.0.0',
            devDependencies: {
              declapract: `file:${rootDir}`,
              'declapract-typescript-ehmpathy': '0.47.7',
              tsx: '^4.19.4',
            },
          },
          null,
          2,
        ),
      );

      // setup declapract.use.yml
      fs.writeFileSync(
        path.join(tmpDir, 'declapract.use.yml'),
        [
          'declarations: npm:declapract-typescript-ehmpathy',
          'useCase: npm-package',
          'variables:',
          '  organizationName: test-org',
          '  projectName: test-project',
        ].join('\n'),
      );

      // install dependencies via npm (pnpm has corepack issues in tmp dirs)
      execSync('npm install', { cwd: tmpDir, stdio: 'pipe' });
    });

    afterAll(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    when('invoked with plan', () => {
      then('it should load practices from the npm module', () => {
        // bin/run re-execs with --import tsx/esm to handle .declapract.ts files in node_modules
        const output = execSync(`node ${binPath} plan`, {
          cwd: tmpDir,
          encoding: 'utf-8',
        });
        expect(output).toContain('declapract');
      });
    });
  });
});
