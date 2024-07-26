import { JSONParsingError, parseJSON } from './parseJSON';

describe('parseJSON', () => {
  it('should be able to parse normal json', () => {
    const original = { hello: 'world' };
    const output = parseJSON(JSON.stringify(original));
    expect(output).toEqual(original);
  });
  it('should be able to parse json5', () => {
    const input = `{"hello": "world", }`; // note the trailing comma
    const output = parseJSON(input);
    expect(output).toEqual({ hello: 'world' });
  });
  it('should throw an error if neither is able to parse', () => {
    const input = `{"hello": z "world", }`; // note the random z
    try {
      parseJSON(input);
      throw new Error('should not reach here');
    } catch (error) {
      expect(error).toBeInstanceOf(JSONParsingError);
      expect(error.message).toContain(
        `Could not parse contents as neither JSON nor JSON5.`,
      );
    }
  });
});
