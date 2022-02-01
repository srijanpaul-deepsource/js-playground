import { parse as tsparse } from '@typescript-eslint/typescript-estree';

/**
 * Parser for TypeScript (.ts) code
 */
export default class TSParser {
  defaultOptions = {
    range: true,
    loc: true,
    comment: true,
    tokens: true,
    ecmaVersion: 'latest',
  };
  options: Object;

  constructor(options: Object) {
    this.options = Object.assign(this.defaultOptions, options);
  }

  /**
   * Parses the given code
   * @param code The code to be parsed
   * @returns the AST of the parsed code
   */
  parse(code: string) {
    return tsparse(code, this.options);
  }
}
