import { convertReport, ReportDescriptor } from './ds-utils';
import ASTVisitor from './ast-visitor';
import { Node, VariableDeclarator } from 'estree';

type VarKind = 'let' | 'const' | 'var' | 'global' | 'unknown';

/**
 * A variable in JS/TS source code emerging either from a var declaration or a parameter
 * or the global scope (eg - 'window').
 */
export type Variable = {
  name: string;
  kind: VarKind;
  // The scope where this variable has been declared.
  declScope: Scope;
};

class Scope {
  private readonly variables = new Map<string, Variable>();
  readonly parent: Scope | null;

  constructor(parentScope?: Scope) {
    this.parent = parentScope ?? null;
  }

  /**
   * Checks if a variable is present in this scope.
   * Does not check parent scopes.
   * @param name Name of the variable to look for
   * @returns true if the variable exists.
   */
  hasVariable(name: string): boolean {
    return this.variables.has(name);
  }

  /**
   * Find a variable by it's name. Does not check parent scopes.
   * @param name Name of the variable to look for
   * @returns the variable with name `name` or `null`.
   */
  getVariable(name: string): Variable | null {
    return this.variables.get(name) ?? null;
  }

  /**
   * Adds a new variable to the current scope. 
   * @returns true if a new variable was added, false if an existing variable was overriden.
   */
  setVariable(name: string, kind: VarKind): boolean {
    const isOverride = this.variables.has(name);
    this.variables.set(name, { name, kind, declScope: this});
    return !isOverride;
  }

  /**
   * Find a variable by it's name.
   * Searches the parent scope if it's not found in the current scope.
   * @param name Name of the variable to look for.
   * @returns The variable called `name`, if it exists. Returns `null` if it doesn't.
   */
  searchVariable(name: string): Variable | null {
    const varInSelf = this.getVariable(name);
    if (varInSelf) return varInSelf;
    return this.parent?.searchVariable(name) ?? null;
  }
}

/**
 * A CheckerContext encapsulates the current state of an ASTVisitor.
 */
export default class VisitorContext {
  private readonly visitor: ASTVisitor;
  private readonly filePath: string;
  private readonly sourceString: string;

  private currentScope = new Scope();
  readonly globalScope = this.currentScope;

  constructor(visitor: ASTVisitor, filePath: string, sourceString: string) {
    this.visitor = visitor;
    this.filePath = filePath;
    this.sourceString = sourceString;
  }

  /**
   * Find's a variable by it's name. Returns `null` if no such variable is found.
   */
  findVarByName(name: string): Variable | null {
    return this.currentScope.searchVariable(name);
  }

  /**
   * Adds a new variable to the current scope.
   * @returns `true` if a new variable was added.
   * `false` if an old one was overwritten.
   */
  addVariableToScope(name: string, kind?: VarKind): boolean {
    return this.currentScope.setVariable(name, kind || 'unknown');
  }

  /**
   * @typedef {Object} Report An object describing an issue raised.
   * @property {string} message
   * @property {SourcePosition|Location} loc
   */

  // Returns the current scope.
  getScope(): Scope {
    return this.currentScope;
  }

  // Enter a new block scope
  enterScope() {
    const newScope = new Scope(this.currentScope);
    this.currentScope = newScope;
  }

  // Exit the currently active scope
  exitScope() {
    const prevScope = this.currentScope.parent;
    if (!prevScope) throw new Error("Attempt to exit global scope");
    this.currentScope = prevScope;
  }

  // Raise an issue.
  report(reportDesc: ReportDescriptor): void {
    const finalReport = convertReport(reportDesc, this.filePath);
    this.visitor.collectReport(finalReport);
  }
}
