const { parseJS } = require('./parse');
const Check = require('./check');
const checkDescriptors = require('./checks');
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
  const checks = checkDescriptors.map(desc => new Check(desc));
  visitor = visitor || new ASTVisitor(filePath, code, checks);
  visitor.visit(ast);

  // TODO (@injuly): Instead of logging them, return the reports array.
  visitor.logReports();
}

module.exports = analyzeJS;
