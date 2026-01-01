import { execSync } from 'child_process';
import path from 'path';

import { given, then, when } from 'test-fns';

const binPath = path.join(__dirname, '..', 'bin', 'run');

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
});
