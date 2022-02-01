import clc from 'cli-color';
import {
  ArrayExpression,
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
  Identifier,
  IfStatement,
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

import { assert } from '../util';

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

  /**
   * `checksForNodeType[x]` Returns a list of all the checks that are concerned
   * with the node of type `x`.
   */
  private checksForNodeType: IChecksForNodeName = {};
  private context: VisitorContext;
  // The list of issues reported so far in DeepSource's format.
  private issues: Issue[] = [];

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
    this.context = new VisitorContext(this, filePath, source);
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

  /**
   * Visit an AST Node, executing all corresponding checks and recusrively
   * visiting it's children .
   * @param node The node to visit.
   * @param parent Parent / surrounding node of `node`.
   */
  visit(node: Node | null, parent?: Node): void {
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

    // 2. Call the visitor's own function for this node type.
    // @ts-ignore
    if (this[type]) this[type](node);
  }

  Program(node: Program): void {
    this.context.enterScope(node);
    for (const stat of node.body) {
      this.visit(stat, node);
    }
  }

  VariableDeclaration(node: VariableDeclaration): void {
    for (const decl of node.declarations) {
      this.visit(decl, node);
    }
  }

  VariableDeclarator(node: WithParent<VariableDeclarator>): void {
    const { id, init } = node;

    const declaration = node.parent;
    assert(
      declaration && declaration.type === 'VariableDeclaration',
      'parent of declarator must be declaration'
    );
    if (!declaration) return;

    const { kind } = declaration as VariableDeclaration;
    assert(typeof kind === 'string');

    function addVarsToScope(lhs: Pattern, parent: Node): void {
      // TODO
    }

    addVarsToScope(id, node);
    this.visit(id);
    if (init) this.visit(init, node);
  }

  ArrayExpression(node: ArrayExpression): void {
    for (const el of node.elements) {
      this.visit(el, node);
    }
  }

  BlockStatement(node: BlockStatement): void {
    for (const stat of node.body) {
      this.visit(stat, node);
    }
  }

  ExpressionStatement(node: ExpressionStatement): void {
    this.visit(node.expression, node);
  }

  AssignmentExpression(node: AssignmentExpression): void {
    this.visit(node.left, node);
    this.visit(node.right, node);
  }

  MemberExpression(node: MemberExpression): void {
    this.visit(node.object, node);
    this.visit(node.property, node);
  }

  ObjectExpression(node: ObjectExpression) {
    for (const property of node.properties) {
      this.visit(property, node);
    }
  }

  Property(node: Property): void {
    this.visit(node.key, node);
    this.visit(node.value, node);
  }

  CallExpression(node: CallExpression): void {
    this.visit(node.callee, node);
    for (const arg of node.arguments) {
      this.visit(arg, node);
    }
  }

  BinaryExpression(node: BinaryExpression): void {
    this.visit(node.left, node);
    this.visit(node.right, node);
  }

  ReturnStatement(node: ReturnStatement): void {
    this.visit(node.argument ?? null, node);
  }

  TemplateLiteral(node: TemplateLiteral): void {
    for (const exp of node.expressions) {
      this.visit(exp, node);
    }
  }

  UnaryExpression(node: UnaryExpression): void {
    this.visit(node.argument, node);
  }

  ForStatement(node: ForStatement): void {
    this.visit(node.init ?? null, node);
    this.visit(node.test ?? null, node);
    this.visit(node.update ?? null, node);
    this.visit(node.body, node);
  }

  ForInStatement(node: ForInStatement): void {
    this.visit(node.left, node);
    this.visit(node.right, node);
    this.visit(node.body, node);
  }

  ForOfStatement(node: ForOfStatement): void {
    this.visit(node.left, node);
    this.visit(node.right, node);
    this.visit(node.body, node);
  }

  WhileStatement(node: WhileStatement): void {
    this.visit(node.body, node);
  }

  IfStatement(node: IfStatement): void {
    this.visit(node.test, node);
    this.visit(node.consequent, node);
    if (node.alternate) this.visit(node.alternate, node);
  }

  DoWhileStatement(node: DoWhileStatement): void {
    this.visit(node.body, node);
  }

  TryStatement(node: TryStatement): void {
    this.visit(node.block, node);
    if (node.handler) this.visit(node.handler, node);
    if (node.finalizer) this.visit(node.finalizer, node);
  }

  CatchClause(node: CatchClause): void {
    this.visit(node.param, node);
    this.visit(node.body, node);
  }

  ThrowStatement(node: ThrowStatement): void {
    this.visit(node.argument, node);
  }

  AssignmentPattern(node: AssignmentPattern): void {
    this.visit(node.left, node);
    this.visit(node.right, node);
  }
}
