// @ts-ignore
import { parse as jsxparse } from 'espree';

/**
 * Parser for JSX (.jsx) code
 */
export default class JSXParser {
  defaultOptions = {
    range: true,
    loc: true,
    comment: true,
    tokens: true,
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true,
    },
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
    return jsxparse(code, this.options);
  }
}
