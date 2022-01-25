import { ArrayExpression, AssignmentExpression, BlockStatement, CallExpression, ExpressionStatement, MemberExpression, Node, ObjectExpression, Position as ESTreePosition, Program, Property, SourceLocation, VariableDeclaration, VariableDeclarator } from "estree";
import Check from "./check";

export type Coordinate = {
  line: number;
  column: number;
}

export type Position = {
  begin: Coordinate;
  end: Coordinate;
}

export type Location = {
  path: string;
  position: Position;
}

export type Issue = {
  issue_text: string;
  issue_code: string;
  location: Location;
}

export type ReportDescriptor = {
  message: string;
  loc: SourceLocation | ESTreePosition;
}

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
          column: loc.end.column
        }
      }
    }

    loc = loc as Coordinate;
    return {
      begin: {
        line: loc.line,
        column: loc.column
      },

      end: {
        line: loc.line,
        column: loc.column
      }
    }
  }

  /**
   * Convert a report object into a deepsource compatible issue.
   * @param {Report} reportDesc 
   * @returns {Issue}
   */
  formatReport(reportDesc: ReportDescriptor) {
    const position = this.formatPosition(reportDesc.loc);

    // TODO (injuly): Add issue codes too!
    const dsReport: Issue = {
      issue_text: reportDesc.message,
      issue_code: '404',
      location: {
        path: this.filePath,
        position
      }
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
type Indexable = {
  [k: string]: Check[];
};
export default class ASTVisitor {
  private filePath: string;
  private checks: Check[];

  private checksForNodeType: Indexable = {};
  private context: CheckerContext;
  private issues: Issue[] = [];
  /**
   * @param {string} filePath Path to the JS file (used for reporting).
   * @param {string} source The contents of the JS file.
   * @param {Check[]|undefined} checks The checks to apply to this source file.
   */
  constructor(filePath: string, source: string, checks?: Check[]) {
    // `checksForNodeType[x]` returns a list of all checks that are
    // concerned with the node type `x`.

    this.checksForNodeType = {};
    this.checks = checks || [];
    for (const check of this.checks) {
      this.addCheck(check);
    }

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

  collectReport(report: Issue) {
    this.issues.push(report);
  }

  logReports(log = console.log) {
    log(`In ${this.filePath}: `);
    this.issues.forEach(issue => {
      const { begin } = issue.location.position;
      const fmt = `Ln ${begin.line}, Col ${begin.column}: ${issue.issue_text}`;
      log(fmt);
    });
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

  Program(node: Program): void {
    for (const stat of node.body) {
      this.visit(stat);
    }
  }

  VariableDeclaration(node: VariableDeclaration): void {
    for (const decl of node.declarations) {
      this.visit(decl);
    }
  }

  VariableDeclarator(node: VariableDeclarator): void {
    this.visit(node.id);
    if (node.init) this.visit(node.init);
  }

  ArrayExpression(node: ArrayExpression) {
    for (const el of node.elements) {
      this.visit(el);
    }
  }

  BlockStatement(node: BlockStatement): void {
    for (const stat of node.body) {
      this.visit(stat);
    }
  }

  ExpressionStatement(node: ExpressionStatement): void {
    this.visit(node.expression);
  }

  AssignmentExpression(node: AssignmentExpression): void {
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
}

