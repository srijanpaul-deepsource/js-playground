const espree = require('espree');

/**
 * @brief parses regular ES compatible JavaScript source code.
 * @param {string} code The JS source code to parse
 * @returns An AST representation of the code, with location information
 */
function parseJS(code) {
  return espree.parse(code, {
    range: true,
    loc: true,
    comments: true,
    tokens: true,
    ecmaVersion: 'latest'
  });
}

module.exports = {
  parseJS,
};
