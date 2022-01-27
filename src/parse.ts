import { Program } from 'estree';
const espree = require('espree');

/**
 * Parses regular ES compatible JavaScript source code.
 * @param code The JS source code to parse
 * @returns An ESTree compatible AST representation of the code, with location information
 */
export function parseJS(code: string): Program {
  return espree.parse(code, {
    range: true,
    loc: true,
    comments: true,
    tokens: true,
    ecmaVersion: 'latest',
  });
}
