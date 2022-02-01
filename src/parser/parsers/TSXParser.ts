import { parse as txsparse } from '@typescript-eslint/typescript-estree';

/**
 * Parser for TSX (.tsx) code
 */
export default class TSXParser {
  defaultOptions = {
    range: true,
    loc: true,
    comment: true,
    tokens: true,
    ecmaVersion: 'latest',
    jsx: true,
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
    return txsparse(code, this.options);
  }
}
