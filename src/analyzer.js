const { parseJS } = require('./parse');
const Check = require('./check');
const arrayGaps = require('./checks/array-gaps');
const noMultipleExports = require('./checks/no-multiple-exports');
const ASTVisitor = require('./visitor');

function analyzeJS(fileName, code, visitor) {
  // TODO (@injuly): handle parsing errors (if any).
  const ast = parseJS(code);
  visitor = visitor || new ASTVisitor();
  visitor.addCheck(new Check(arrayGaps));
  visitor.addCheck(new Check(noMultipleExports));
  visitor.visit(ast);
}

module.exports = analyzeJS;
