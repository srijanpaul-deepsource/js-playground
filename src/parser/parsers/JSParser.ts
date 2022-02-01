//@ts-ignore
import { parse as jsparse } from 'espree';

/**
 * Parser for JavaScript (.js) code
 */
export default class JSParser {
  defaultOptions = {
    range: true,
    loc: true,
    comment: true,
    tokens: true,
    ecmaVersion: 'latest',
  };
  options: object;

  constructor(options: object) {
    this.options = Object.assign(this.defaultOptions, options);
  }

  /**
   * Parses the given code
   * @param code The code to be parsed
   * @returns the AST of the parsed code
   */
  parse(code: string) {
    return jsparse(code, this.options);
  }
}
