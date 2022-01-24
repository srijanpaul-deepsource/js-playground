const { parseJS } = require('./parse');
const Check = require('./check');
const arrayGaps = require('./checks/array-gaps');
const ASTVisitor = require('./visitor');

function analyzeJS(fileName, code, visitor) {
  // TODO (@injuly): handle parsing errors (if any).
  const ast = parseJS(code);
  visitor = visitor || new ASTVisitor();
  const arrayGapsRule = new Check(arrayGaps);
  visitor.addCheck(arrayGapsRule);
  visitor.visit(ast);
}

module.exports = analyzeJS;
