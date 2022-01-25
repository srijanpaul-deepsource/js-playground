import ASTVisitor from './visitor';
import Check, { CheckDescriptor } from './check';
const { parseJS } = require('./parse');
const checkDescriptors = require('./checks');

/**
 * Analyzes a Javascript file and logs the analysis report.
 * @param {string} filePath Path of the source file.
 * @param {string} code JS Source code to analyze 
 * @param {ASTVisitor | undefined} visitor The ASTVisitor to use.
 */
function analyzeJS(filePath: string, code: string, visitor?: ASTVisitor) {
  // TODO (@injuly): handle parsing errors (if any).
  const ast = parseJS(code);
  const checks = checkDescriptors.map((desc: CheckDescriptor) => new Check(desc));
  visitor = visitor || new ASTVisitor(filePath, code, checks);
  visitor.visit(ast);

  // TODO (@injuly): Instead of logging them, return the reports array.
  visitor.logReports();
}

module.exports = analyzeJS;
