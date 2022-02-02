import { convertReport, ReportDescriptor } from './ds-utils';
import ASTVisitor from './ast-visitor';
import { Scope } from './scope';
import ESTree from 'estree';
import { analyzeScope, ESCopeOptions } from './scope-manager';

/**
 * A CheckerContext encapsulates the current state of an ASTVisitor.
 */
export default class VisitorContext {
  private readonly visitor: ASTVisitor;
  private readonly filePath: string;
  private readonly sourceString: string;
  private currentScope: Scope.Scope | null = null;
  private scopeManager: Scope.ScopeManager;
  private ast: ESTree.Program;

  constructor(
    visitor: ASTVisitor,
    filePath: string,
    sourceString: string,
    ast: ESTree.Program,
    config: ESCopeOptions
  ) {
    this.visitor = visitor;
    this.filePath = filePath;
    this.sourceString = sourceString;
    this.ast = ast;
    this.scopeManager = analyzeScope(ast, config);
  }

  // Get the scope assosciated with `node`.
  getScope(): Scope.Scope | null  {
    return this.currentScope;
  }

  /**
   * Find the object describing a variable by it's name.
   * @param name Name of the variable.
   * @param initScope The innermost scope where to start looking from.
   * @returns 
   */
  getVariableByName(name: string, initScope: Scope.Scope): Scope.Variable | null {
    let scope: Scope.Scope | null = initScope;
    while (scope) {
      const variable = scope.set.get(name);
      if (variable) return variable;
      scope = scope.upper;
    }
    return null;
  }

  /**
   * Set the currently active scope to that of `node`.
   * @param node The Node which might have a scope assosciated with it.
   */
  setScopeToNode(node: ESTree.Node): void {
    const scope = this.scopeManager.acquire(node);
    if (scope) this.currentScope = scope;
  }

  // Raise an issue.
  report(reportDesc: ReportDescriptor): void {
    const finalReport = convertReport(reportDesc, this.filePath);
    this.visitor.collectReport(finalReport);
  }
}
