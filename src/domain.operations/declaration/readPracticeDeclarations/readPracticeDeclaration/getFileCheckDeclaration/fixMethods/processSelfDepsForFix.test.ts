import { processSelfDepsForFix } from './processSelfDepsForFix';

describe('processSelfDepsForFix', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('omit self-dep when not link:./file:.', () => {
    it('should omit self-dep when absent in found', () => {
      const result = processSelfDepsForFix({
        declared: {
          name: 'sql-dao-generator',
          dependencies: {
            'sql-dao-generator': "@declapract{check.minVersion('0.22.0')}",
            lodash: '^4.0.0',
          },
        },
        found: {
          name: 'sql-dao-generator',
          dependencies: {
            lodash: '^4.0.0',
          },
        },
        targetPackageName: 'sql-dao-generator',
      });

      // self-dep omitted, lodash preserved
      expect(result).toEqual({
        name: 'sql-dao-generator',
        dependencies: {
          lodash: '^4.0.0',
        },
      });

      // warn emitted
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('omit self-dependency');
    });

    it('should omit self-dep when extant has version (not link:./file:.)', () => {
      const result = processSelfDepsForFix({
        declared: {
          name: 'my-package',
          dependencies: {
            'my-package': "@declapract{check.minVersion('2.0.0')}",
          },
        },
        found: {
          name: 'my-package',
          dependencies: {
            'my-package': '1.0.0', // extant version, not link:./file:.
          },
        },
        targetPackageName: 'my-package',
      });

      // self-dep omitted (deps key removed entirely)
      expect(result).toEqual({
        name: 'my-package',
      });

      // warn emitted
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('omit self-dependency');
    });
  });

  describe('preserve self-dep when extant is link:./file:.', () => {
    it('should preserve when extant is link:.', () => {
      const result = processSelfDepsForFix({
        declared: {
          name: 'sql-dao-generator',
          dependencies: {
            'sql-dao-generator': "@declapract{check.minVersion('0.22.0')}",
          },
        },
        found: {
          name: 'sql-dao-generator',
          dependencies: {
            'sql-dao-generator': 'link:.',
          },
        },
        targetPackageName: 'sql-dao-generator',
      });

      // declared version kept (so deepReplace will preserve link:.)
      expect(result).toEqual({
        name: 'sql-dao-generator',
        dependencies: {
          'sql-dao-generator': "@declapract{check.minVersion('0.22.0')}",
        },
      });

      // preserved warn emitted
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('preserve self-dependency');
    });

    it('should preserve when extant is file:.', () => {
      const result = processSelfDepsForFix({
        declared: {
          name: 'my-plugin',
          devDependencies: {
            'my-plugin': "@declapract{check.minVersion('1.0.0')}",
          },
        },
        found: {
          name: 'my-plugin',
          devDependencies: {
            'my-plugin': 'file:.',
          },
        },
        targetPackageName: 'my-plugin',
      });

      // declared version kept
      expect(result).toEqual({
        name: 'my-plugin',
        devDependencies: {
          'my-plugin': "@declapract{check.minVersion('1.0.0')}",
        },
      });

      // preserved warn emitted
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('preserve self-dependency');
    });
  });

  describe('different packages not affected', () => {
    it('should not affect non-self deps', () => {
      const result = processSelfDepsForFix({
        declared: {
          name: 'my-project',
          dependencies: {
            'sql-dao-generator': "@declapract{check.minVersion('0.22.0')}",
            'domain-objects': '^1.0.0',
          },
        },
        found: {
          name: 'my-project',
          dependencies: {},
        },
        targetPackageName: 'my-project',
      });

      // all deps preserved (none are self-deps)
      expect(result).toEqual({
        name: 'my-project',
        dependencies: {
          'sql-dao-generator': "@declapract{check.minVersion('0.22.0')}",
          'domain-objects': '^1.0.0',
        },
      });

      // no warns emitted
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('all dep types handled', () => {
    it('should handle self-deps in devDependencies', () => {
      const result = processSelfDepsForFix({
        declared: {
          name: 'pkg',
          devDependencies: { pkg: '^1.0.0' },
        },
        found: { name: 'pkg' },
        targetPackageName: 'pkg',
      });

      expect(result).toEqual({ name: 'pkg' });
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle self-deps in peerDependencies', () => {
      const result = processSelfDepsForFix({
        declared: {
          name: 'pkg',
          peerDependencies: { pkg: '>=1.0.0' },
        },
        found: { name: 'pkg' },
        targetPackageName: 'pkg',
      });

      expect(result).toEqual({ name: 'pkg' });
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle self-deps in optionalDependencies', () => {
      const result = processSelfDepsForFix({
        declared: {
          name: 'pkg',
          optionalDependencies: { pkg: '1.0.0' },
        },
        found: { name: 'pkg' },
        targetPackageName: 'pkg',
      });

      expect(result).toEqual({ name: 'pkg' });
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('scoped packages', () => {
    it('should handle scoped package self-dep', () => {
      const result = processSelfDepsForFix({
        declared: {
          name: '@ehmpathy/sql-dao-generator',
          dependencies: {
            '@ehmpathy/sql-dao-generator': '^0.22.0',
          },
        },
        found: {
          name: '@ehmpathy/sql-dao-generator',
        },
        targetPackageName: '@ehmpathy/sql-dao-generator',
      });

      expect(result).toEqual({
        name: '@ehmpathy/sql-dao-generator',
      });
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });
  });
});
