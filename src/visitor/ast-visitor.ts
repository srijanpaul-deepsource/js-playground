import clc from 'cli-color';
import {
  ArrayExpression,
  ArrowFunctionExpression,
  AssignmentExpression,
  AssignmentPattern,
  BinaryExpression,
  BlockStatement,
  CallExpression,
  CatchClause,
  DoWhileStatement,
  ExpressionStatement,
  ForInStatement,
  ForOfStatement,
  ForStatement,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  IfStatement,
  ImportDeclaration,
  MemberExpression,
  Node,
  ObjectExpression,
  Pattern,
  Program,
  Property,
  ReturnStatement,
  TemplateLiteral,
  ThrowStatement,
  TryStatement,
  UnaryExpression,
  VariableDeclaration,
  VariableDeclarator,
  WhileStatement,
} from 'estree';
import Check from '../check';
import VisitorContext from './visitor-context';
import { Issue } from './ds-utils';

import { assert, ASTNode } from '../util';

type IChecksForNodeName = {
  [k: string]: Check[];
};

export type NodeParentExtension = {
  parent?: Node;
};

export type WithParent<T extends Node> = T & NodeParentExtension;

/**
 * A base AST visitor class that recursively visits every AST Node and executes the checks
 */
export default class ASTVisitor {
  private filePath: string;
  private source: string;
  private checks: Check[];

  // Nodes that may affect the scope structure by introducing a new scope
  // in the current chain of scopes.
  static ScopingNodeTypes = new Set([
    ASTNode.Program,
    ASTNode.BlockStatement,
    ASTNode.FunctionDeclaration,
    ASTNode.FunctionExpression,
    ASTNode.ArrowFunctionExpression,
    ASTNode.CatchClause,
    ASTNode.ForStatement,
    ASTNode.ForInStatement,
    ASTNode.ForOfStatement,
    ASTNode.WhileStatement,
    ASTNode.DoWhileStatement,
    ASTNode.IfStatement,
    ASTNode.WhileStatement,
  ]);

  /**
   * `checksForNodeType[x]` Returns a list of all the checks that are concerned
   * with the node of type `x`.
   */
  private checksForNodeType: IChecksForNodeName = {};
  private context?: VisitorContext;
  // The list of issues reported so far in DeepSource's format.
  private issues: Issue[] = [];

  private currentNode: Node | null = null;

  /**
   * @param filePath Path to the JS file (used for issue reporting).
   * @param source The contents of the JS file.
   * @param checks The checks to apply to this source file.
   */
  constructor(filePath: string, source: string, checks?: Check[]) {
    this.checksForNodeType = {};
    this.checks = checks || [];
    this.checks.forEach(check => this.addCheck(check));
    this.source = source;
    this.filePath = filePath;
  }

  /**
   * Add a new check to the analysis.
   * @param check The check to add.
   */
  addCheck(check: Check): void {
    for (const nodeName of check.nodesToVisit) {
      if (!this.checksForNodeType[nodeName]) {
        this.checksForNodeType[nodeName] = [];
      }
      this.checksForNodeType[nodeName].push(check);
    }
  }

  /**
   * Add an issue to be raised once analysis is completed.
   */
  collectReport(report: Issue): void {
    this.issues.push(report);
  }

  logReports(log = console.log): void {
    log(`In ${clc.bold(this.filePath)}: `);
    this.issues.forEach(issue => {
      const { begin } = issue.location.position;
      const loc = clc.redBright(`Ln ${begin.line}, Col ${begin.column}`);
      const fmt = `${loc}: ${issue.issue_text}`;
      log(fmt);
    });
    log();
  }

  checkAST(program: Program, conf: Object = {}): Issue[] {
    this.context = new VisitorContext(this, this.filePath, this.source, program, {});
    this.visit(program);
    return this.issues;
  }

  /**
   * Visit an AST Node, executing all corresponding checks and recusrively
   * visiting it's children .
   * @param node The node to visit.
   * @param parent Parent / surrounding node of `node`.
   */
  private visit(node: Node | null, parent?: Node): void {
    if (!node) return;

    // Extend the node with it's parent so that checks can refer to it.
    (node as WithParent<Node>).parent = parent;

    const { type } = node;
    // 1. Look for all rules that are concerned with this node type
    // and call them.
    const checksForNode = this.checksForNodeType[type];
    if (checksForNode) {
      for (const check of checksForNode) {
        // This is a bit of a dynamic hack but we'll allow TS-Ignore :>
        // @ts-ignore
        check.visitor[type](this.context, node);
      }
    }

    const prevNode = this.currentNode;
    this.currentNode = node;
    // If this node affects the scope then make the context reflect that change.
    const affectsScope = ASTVisitor.ScopingNodeTypes.has(type);
    if (affectsScope) {
      this.context?.setScopeToNode(node);
    }

    // 2. Call the visitor's own function for this node type.
    // @ts-ignore
    if (this[type]) this[type](node);

    this.currentNode = prevNode;
    if (this.currentNode && affectsScope) {
      this.context?.setScopeToNode(this.currentNode);
    }
  }

  private Program(node: Program): void {
    for (const stat of node.body) {
      this.visit(stat, node);
    }
  }

  private VariableDeclaration(node: VariableDeclaration): void {
    for (const decl of node.declarations) {
      this.visit(decl, node);
    }
  }

  private VariableDeclarator(node: WithParent<VariableDeclarator>): void {
    const { id, init } = node;
    this.visit(id);
    if (init) this.visit(init, node);
  }

  private ArrayExpression(node: ArrayExpression): void {
    for (const el of node.elements) {
      this.visit(el, node);
    }
  }

  private BlockStatement(node: BlockStatement): void {
    for (const stat of node.body) {
      this.visit(stat, node);
    }
  }

  private ExpressionStatement(node: ExpressionStatement): void {
    this.visit(node.expression, node);
  }

  private AssignmentExpression(node: AssignmentExpression): void {
    this.visit(node.left, node);
    this.visit(node.right, node);
  }

  private MemberExpression(node: MemberExpression): void {
    this.visit(node.object, node);
    this.visit(node.property, node);
  }

  private ObjectExpression(node: ObjectExpression): void {
    for (const property of node.properties) {
      this.visit(property, node);
    }
  }

  private Property(node: Property): void {
    this.visit(node.key, node);
    this.visit(node.value, node);
  }

  private CallExpression(node: CallExpression): void {
    this.visit(node.callee, node);
    for (const arg of node.arguments) {
      this.visit(arg, node);
    }
  }

  private BinaryExpression(node: BinaryExpression): void {
    this.visit(node.left, node);
    this.visit(node.right, node);
  }

  private ReturnStatement(node: ReturnStatement): void {
    this.visit(node.argument ?? null, node);
  }

  private TemplateLiteral(node: TemplateLiteral): void {
    for (const exp of node.expressions) {
      this.visit(exp, node);
    }
  }

  private UnaryExpression(node: UnaryExpression): void {
    this.visit(node.argument, node);
  }

  private ForStatement(node: ForStatement): void {
    this.visit(node.init ?? null, node);
    this.visit(node.test ?? null, node);
    this.visit(node.update ?? null, node);
    this.visit(node.body, node);
  }

  private ForInStatement(node: ForInStatement): void {
    this.visit(node.left, node);
    this.visit(node.right, node);
    this.visit(node.body, node);
  }

  private ForOfStatement(node: ForOfStatement): void {
    this.visit(node.left, node);
    this.visit(node.right, node);
    this.visit(node.body, node);
  }

  private WhileStatement(node: WhileStatement): void {
    this.visit(node.body, node);
  }

  private IfStatement(node: IfStatement): void {
    this.visit(node.test, node);
    this.visit(node.consequent, node);
    if (node.alternate) this.visit(node.alternate, node);
  }

  private DoWhileStatement(node: DoWhileStatement): void {
    this.visit(node.body, node);
  }

  private TryStatement(node: TryStatement): void {
    this.visit(node.block, node);
    if (node.handler) this.visit(node.handler, node);
    if (node.finalizer) this.visit(node.finalizer, node);
  }

  private CatchClause(node: CatchClause): void {
    this.visit(node.param, node);
    this.visit(node.body, node);
  }

  private ThrowStatement(node: ThrowStatement): void {
    this.visit(node.argument, node);
  }

  private AssignmentPattern(node: AssignmentPattern): void {
    this.visit(node.left, node);
    this.visit(node.right, node);
  }

  private ImportDeclaration(node: ImportDeclaration): void {
    this.visit(node.source, node);
    for (const specifier of node.specifiers) {
      this.visit(specifier, node);
    }
  }

  private FunctionDeclaration(node: FunctionDeclaration): void {
    this.visit(node.id, node);
    this.visit(node.body, node);
    for (const param of node.params) {
      this.visit(param, node);
    }
  }

  FunctionExpression(node: FunctionExpression): void {
    if (node.id) this.visit(node.id, node);
    this.visit(node.body, node);
    for (const param of node.params) this.visit(param, node);
  }

  ArrowFunctionExpression(node: ArrowFunctionExpression): void {
    this.visit(node.body, node);
    for (const param of node.params) {
      this.visit(param, node);
    }
  }
}
