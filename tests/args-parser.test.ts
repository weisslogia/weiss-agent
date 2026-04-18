import { parseArgs, ParsedArgs } from '../src/utils/args-parser';

describe('parseArgs', () => {
  it('should parse a simple flag', () => {
    const result = parseArgs(['--verbose']);
    expect(result.verbose).toBe(true);
  });

  it('should parse a flag with value', () => {
    const result = parseArgs(['--name', 'John']);
    expect(result.name).toBe('John');
  });

  it('should parse multiple flags', () => {
    const result = parseArgs(['--verbose', '--name', 'Jane', '--debug']);
    expect(result.verbose).toBe(true);
    expect(result.name).toBe('Jane');
    expect(result.debug).toBe(true);
  });

  it('should handle positional arguments', () => {
    const result = parseArgs(['file.txt', '--verbose']);
    expect(result._?.includes('file.txt')).toBe(true);
  });
});
