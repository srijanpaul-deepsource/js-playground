import clc from 'cli-color';
import {
  ArrayExpression,
  AssignmentExpression,
  AssignmentPattern,
  BinaryExpression,
  BlockStatement,
  CallExpression,
  DoWhileStatement,
  ExpressionStatement,
  ForInStatement,
  ForOfStatement,
  ForStatement,
  IfStatement,
  MemberExpression,
  Node,
  ObjectExpression,
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
import { CheckerContext } from './visitor-context';
import { Issue } from './ds-utils';

type IChecksForNodeName = {
  [k: string]: Check[];
};

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
  private context: CheckerContext;
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
    for (const check of this.checks) {
      this.addCheck(check);
    }

    this.source = source;
    this.filePath = filePath;
    this.context = new CheckerContext(this, filePath, source);
  }

  /**
   * Add a new check to the analysis.
   * @param check The check to add.
   */
  addCheck(check: Check) {
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
  collectReport(report: Issue) {
    this.issues.push(report);
  }

  logReports(log = console.log) {
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
   */
  visit(node?: Node | null): void {
    if (!node) return;

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
    // TODO (injuly): Once all the nodes are covered in our visitor,
    // this `if` statement should be replaced with an assertion.
    // @ts-ignore
    if (this[type]) {
      // @ts-ignore
      this[type](node);
    }
  }

  Program(node: Program) {
    for (const stat of node.body) {
      this.visit(stat);
    }
  }

  VariableDeclaration(node: VariableDeclaration) {
    for (const decl of node.declarations) {
      this.visit(decl);
    }
  }

  VariableDeclarator(node: VariableDeclarator) {
    this.visit(node.id);
    if (node.init) this.visit(node.init);
  }

  ArrayExpression(node: ArrayExpression) {
    for (const el of node.elements) {
      this.visit(el);
    }
  }

  BlockStatement(node: BlockStatement) {
    for (const stat of node.body) {
      this.visit(stat);
    }
  }

  ExpressionStatement(node: ExpressionStatement) {
    this.visit(node.expression);
  }

  AssignmentExpression(node: AssignmentExpression) {
    this.visit(node.left);
    this.visit(node.right);
  }

  MemberExpression(node: MemberExpression) {
    this.visit(node.object);
    this.visit(node.property);
  }

  ObjectExpression(node: ObjectExpression) {
    for (const property of node.properties) {
      this.visit(property);
    }
  }

  Property(node: Property) {
    this.visit(node.key);
    this.visit(node.value);
  }

  CallExpression(node: CallExpression) {
    this.visit(node.callee);
    for (const arg of node.arguments) {
      this.visit(arg);
    }
  }

  BinaryExpression(node: BinaryExpression) {
    this.visit(node.left);
    this.visit(node.right);
  }

  ReturnStatement(node: ReturnStatement) {
    this.visit(node.argument);
  }

  TemplateLiteral(node: TemplateLiteral) {
    for (const exp of node.expressions) {
      this.visit(exp);
    }
  }

  UnaryExpression(node: UnaryExpression) {
    this.visit(node.argument);
  }

  ForStatement(node: ForStatement) {
    this.visit(node.init);
    this.visit(node.test);
    this.visit(node.update);
    this.visit(node.body);
  }

  ForInStatement(node: ForInStatement) {
    this.visit(node.left);
    this.visit(node.right);
    this.visit(node.body);
  }

  ForOfStatement(node: ForOfStatement) {
    this.visit(node.left);
    this.visit(node.right);
    this.visit(node.body);
  }

  WhileStatement(node: WhileStatement) {
    this.visit(node.body);
  }

  IfStatement(node: IfStatement) {
    this.visit(node.test);
    this.visit(node.consequent);
    this.visit(node.alternate);
  }

  DoWhileStatement(node: DoWhileStatement) {
    this.visit(node.body);
  }

  TryStatement(node: TryStatement) {
    this.visit(node.block);
    this.visit(node.handler);
    this.visit(node.finalizer);
  }

  ThrowStatement(node: ThrowStatement) {
    this.visit(node.argument);
  }

  AssignmentPattern(node: AssignmentPattern) {
    this.visit(node.left);
    this.visit(node.right);
  }
}
