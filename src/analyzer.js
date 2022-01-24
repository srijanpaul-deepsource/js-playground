const { parseJS } = require('./parse');
const Check = require('./check');
const arrayGaps = require('./checks/array-gaps');
const noMultipleExports = require('./checks/no-multiple-exports');
const ASTVisitor = require('./visitor');

/**
 * Analyzes a Javascript file and logs the analysis report.
 * @param {string} filePath Path of the source file.
 * @param {string} code JS Source code to analyze 
 * @param {ASTVisitor | undefined} visitor The ASTVisitor to use.
 */
function analyzeJS(filePath, code, visitor) {
  // TODO (@injuly): handle parsing errors (if any).
  const ast = parseJS(code);
  visitor = visitor || new ASTVisitor(filePath);
  visitor.addCheck(new Check(arrayGaps));
  visitor.addCheck(new Check(noMultipleExports));
  visitor.visit(ast);

  // TODO (@injuly): Instead of logging them, return the reports array.
  visitor.logReports();
}

module.exports = analyzeJS;
