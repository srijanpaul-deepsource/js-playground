import { parse as vueparse } from 'vue-eslint-parser';

/**
 * Parser for Vue.js (.vue) code
 */
export default class VueParser {
  defaultOptions = {
    range: true,
    loc: true,
    comment: true,
    tokens: true,
    ecmaVersion: 'latest',
    parser: {
      js: 'espree',
      ts: '@typescript-eslint/typescript-estree',
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
    //@ts-ignore
    return vueparse(code, this.options).ast;
  }
}
