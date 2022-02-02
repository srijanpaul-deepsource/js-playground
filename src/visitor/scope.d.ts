import ESTree from 'estree';
export namespace Scope {
  interface ScopeManager {
    scopes: Scope[];
    globalScope: Scope | null;
    acquire(node: ESTree.Node, inner?: boolean): Scope | null;
    getDeclaredVariables(node: ESTree.Node): Variable[];
  }

  interface Scope {
    type:
      | 'block'
      | 'catch'
      | 'class'
      | 'for'
      | 'function'
      | 'function-expression-name'
      | 'global'
      | 'module'
      | 'switch'
      | 'with'
      | 'TDZ';
    isStrict: boolean;
    upper: Scope | null;
    childScopes: Scope[];
    variableScope: Scope;
    block: ESTree.Node;
    variables: Variable[];
    set: Map<string, Variable>;
    references: Reference[];
    through: Reference[];
    functionExpressionScope: boolean;
  }

  interface Variable {
    name: string;
    identifiers: ESTree.Identifier[];
    references: Reference[];
    defs: Definition[];
  }

  interface Reference {
    identifier: ESTree.Identifier;
    from: Scope;
    resolved: Variable | null;
    writeExpr: ESTree.Node | null;
    init: boolean;

    isWrite(): boolean;
    isRead(): boolean;
    isWriteOnly(): boolean;
    isReadOnly(): boolean;
    isReadWrite(): boolean;
  }

  type DefinitionType =
    | { type: 'CatchClause'; node: ESTree.CatchClause; parent: null }
    | { type: 'ClassName'; node: ESTree.ClassDeclaration | ESTree.ClassExpression; parent: null }
    | {
        type: 'FunctionName';
        node: ESTree.FunctionDeclaration | ESTree.FunctionExpression;
        parent: null;
      }
    | { type: 'ImplicitGlobalVariable'; node: ESTree.Program; parent: null }
    | {
        type: 'ImportBinding';
        node:
          | ESTree.ImportSpecifier
          | ESTree.ImportDefaultSpecifier
          | ESTree.ImportNamespaceSpecifier;
        parent: ESTree.ImportDeclaration;
      }
    | {
        type: 'Parameter';
        node:
          | ESTree.FunctionDeclaration
          | ESTree.FunctionExpression
          | ESTree.ArrowFunctionExpression;
        parent: null;
      }
    | { type: 'TDZ'; node: any; parent: null }
    | { type: 'Variable'; node: ESTree.VariableDeclarator; parent: ESTree.VariableDeclaration };

  type Definition = DefinitionType & { name: ESTree.Identifier };
}
