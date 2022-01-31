import { convertReport, ReportDescriptor } from './ds-utils';
import ASTVisitor from './ast-visitor';

/**
 * A CheckerContext encapsulates the current state of an ASTVisitor.
 */
export default class VisitorContext {
  private visitor: ASTVisitor;
  private filePath: string;
  private sourceString: string;

  constructor(visitor: ASTVisitor, filePath: string, sourceString: string) {
    this.visitor = visitor;
    this.filePath = filePath;
    this.sourceString = sourceString;
  }

  getScope() {
    // TODO:
  }

  /**
   * @typedef {Object} Report An object describing an issue raised.
   * @property {string} message
   * @property {SourcePosition|Location} loc
   */

  // Raise an issue.
  report(reportDesc: ReportDescriptor): void {
    const finalReport = convertReport(reportDesc, this.filePath);
    this.visitor.collectReport(finalReport);
  }
}
