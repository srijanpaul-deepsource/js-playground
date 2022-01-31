import { convertReport, ReportDescriptor } from './ds-utils';
import ASTVisitor from './ast-visitor';

export class CheckerContext {
  private visitor: ASTVisitor;
  private filePath: string;
  private sourceString: string;

  constructor(visitor: ASTVisitor, filePath: string, sourceString: string) {
    this.visitor = visitor;
    this.filePath = filePath;
    this.sourceString = sourceString;
  }

  getScope() {}

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
