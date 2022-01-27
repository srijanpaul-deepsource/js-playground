import {
  ArrayExpression,
  AssignmentExpression,
  AssignmentPattern,
  BinaryExpression,
  BlockStatement,
  CallExpression,
  DebuggerStatement,
  DoWhileStatement,
  EmptyStatement,
  ExpressionStatement,
  ForInStatement,
  ForOfStatement,
  ForStatement,
  IfStatement,
  MemberExpression,
  Node,
  ObjectExpression,
  Pattern,
  Position as ESTreePosition,
  Program,
  Property,
  ReturnStatement,
  SourceLocation,
  TemplateLiteral,
  ThisExpression,
  ThrowStatement,
  TryStatement,
  UnaryExpression,
  UnaryOperator,
  VariableDeclaration,
  VariableDeclarator,
  WhileStatement,
} from 'estree';
import Check from './check';
import clc from 'cli-color';

export type Coordinate = {
  line: number;
  column: number;
};

export type Position = {
  begin: Coordinate;
  end: Coordinate;
};

export type Location = {
  path: string;
  position: Position;
};

export type Issue = {
  issue_text: string;
  issue_code: string;
  location: Location;
};

export type ReportDescriptor = {
  message: string;
  loc: SourceLocation | ESTreePosition;
};

/**
 * @typedef {Object} Issue A deepsource compatible issue object.
 * @property {string} issue_text A message describing the issue.
 * @property {string} issue_code A deepsource issue code (eg - 'JS-W001').
 * @property {Position} position Position in source where the issue is raised.
 */

class CheckerContext {
  private visitor: ASTVisitor;
  private filePath: string;
  private sourceString: string;
  constructor(visitor: ASTVisitor, filePath: string, sourceString: string) {
    this.visitor = visitor;
    this.filePath = filePath;
    this.sourceString = sourceString;
  }

  formatPosition(loc: SourceLocation | Coordinate): Position {
    // a `loc` attached to an ESTree node can either be a `SourceLocation` object
    // or a `Position` object. However deepsource requires all location info
    // to be in a uniform format.

    // `loc` is a SourceLocation.
    if ((loc as SourceLocation).start) {
      loc = loc as SourceLocation;
      return {
        begin: {
          line: loc.start.line,
          column: loc.start.column,
        },

        end: {
          line: loc.end.line,
          column: loc.end.column,
        },
      };
    }

    loc = loc as Coordinate;
    return {
      begin: {
        line: loc.line,
        column: loc.column,
      },

      end: {
        line: loc.line,
        column: loc.column,
      },
    };
  }

  /**
   * Convert a report object into a deepsource compatible issue.
   * @param {Report} reportDesc The report object to generate an issue from.
   * @returns {Issue}
   */
  formatReport(reportDesc: ReportDescriptor): Issue {
    const position = this.formatPosition(reportDesc.loc);

    // TODO (injuly): Add issue codes too!
    const dsReport: Issue = {
      issue_text: reportDesc.message,
      issue_code: '404',
      location: {
        path: this.filePath,
        position,
      },
    };
    return dsReport;
  }

  /**
   * @typedef {Object} Report An object describing an issue raised.
   * @property {string} message
   * @property {SourcePosition|Location} loc
   */

  /**
   * Raise an issue.
   */
  report(reportDesc: ReportDescriptor) {
    const finalReport = this.formatReport(reportDesc);
    this.visitor.collectReport(finalReport);
  }
}

/**
 * A base AST visitor class that recursively visits every AST Node and executes the checks
 */
type IChecksForNodeName = {
  [k: string]: Check[];
};
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
   * @param {string} filePath Path to the JS file (used for reporting).
   * @param {string} source The contents of the JS file.
   * @param {Check[]|undefined} checks The checks to apply to this source file.
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
   * @param {Check} check The check to add.
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
   * @param {Node} node
   * @returns {void}
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
