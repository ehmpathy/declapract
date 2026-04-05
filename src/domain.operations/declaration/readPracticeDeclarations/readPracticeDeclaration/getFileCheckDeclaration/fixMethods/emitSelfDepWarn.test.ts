import { emitSelfDepWarn } from './emitSelfDepWarn';

describe('emitSelfDepWarn', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('action=omitted → correct format', () => {
    emitSelfDepWarn({
      packageName: 'sql-dao-generator',
      declaredVersion: '0.22.0',
      action: 'omitted',
    });

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const output = consoleSpy.mock.calls[0][0];

    // snapshot the full output for visual review
    expect(output).toMatchSnapshot();

    // explicit assertions for key content
    expect(output).toContain('omit self-dependency sql-dao-generator@0.22.0');
    expect(output).toContain('a package should not depend on itself');
    expect(output).toContain(
      'if intentional, use link:. or file:. to self-reference',
    );
  });

  it('action=preserved → correct format', () => {
    emitSelfDepWarn({
      packageName: 'sql-dao-generator',
      declaredVersion: '0.22.0',
      action: 'preserved',
    });

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const output = consoleSpy.mock.calls[0][0];

    // snapshot the full output for visual review
    expect(output).toMatchSnapshot();

    // explicit assertions for key content
    expect(output).toContain('preserve self-dependency sql-dao-generator');
    expect(output).toContain('extant self-ref was preserved');
    expect(output).toContain('practice declared version was skipped');
  });
});
