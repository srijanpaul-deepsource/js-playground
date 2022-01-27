import ESTree from 'estree';
import JsNodeNames from './util';
import { CheckerContext } from './visitor';

type NodeVisitorFunc<T extends ESTree.BaseNode> = (
  ctx: CheckerContext,
  node: T & ESTree.BaseNode
) => void;

export type CheckDescriptor = {
  cache: Record<string, any>;
  init?: () => void;
  ArrayExpression?: NodeVisitorFunc<ESTree.ArrayExpression>;
  ArrayPattern?: NodeVisitorFunc<ESTree.ArrayPattern>;
  ArrowFunctionExpression?: NodeVisitorFunc<ESTree.ArrowFunctionExpression>;
  AssignmentExpression?: NodeVisitorFunc<ESTree.AssignmentExpression>;
  AssignmentPattern?: NodeVisitorFunc<ESTree.AssignmentPattern>;
  AwaitExpression?: NodeVisitorFunc<ESTree.AwaitExpression>;
  BinaryExpression?: NodeVisitorFunc<ESTree.BinaryExpression>;
  BlockStatement?: NodeVisitorFunc<ESTree.BlockStatement>;
  BreakStatement?: NodeVisitorFunc<ESTree.BreakStatement>;
  CallExpression?: NodeVisitorFunc<ESTree.CallExpression>;
  CatchClause?: NodeVisitorFunc<ESTree.CatchClause>;
  ChainExpression?: NodeVisitorFunc<ESTree.ChainExpression>;
  ClassBody?: NodeVisitorFunc<ESTree.ClassBody>;
  ClassDeclaration?: NodeVisitorFunc<ESTree.ClassDeclaration>;
  ClassExpression?: NodeVisitorFunc<ESTree.ClassExpression>;
  ConditionalExpression?: NodeVisitorFunc<ESTree.ConditionalExpression>;
  ContinueStatement?: NodeVisitorFunc<ESTree.ContinueStatement>;
  DebuggerStatement?: NodeVisitorFunc<ESTree.DebuggerStatement>;
  DoWhileStatement?: NodeVisitorFunc<ESTree.DoWhileStatement>;
  EmptyStatement?: NodeVisitorFunc<ESTree.EmptyStatement>;
  ExportAllDeclaration?: NodeVisitorFunc<ESTree.ExportAllDeclaration>;
  ExportDefaultDeclaration?: NodeVisitorFunc<ESTree.ExportDefaultDeclaration>;
  ExportNamedDeclaration?: NodeVisitorFunc<ESTree.ExportNamedDeclaration>;
  ExportSpecifier?: NodeVisitorFunc<ESTree.ExportSpecifier>;
  ExpressionStatement?: NodeVisitorFunc<ESTree.ExpressionStatement>;
  ForInStatement?: NodeVisitorFunc<ESTree.ForInStatement>;
  ForOfStatement?: NodeVisitorFunc<ESTree.ForOfStatement>;
  ForStatement?: NodeVisitorFunc<ESTree.ForStatement>;
  FunctionDeclaration?: NodeVisitorFunc<ESTree.FunctionDeclaration>;
  FunctionExpression?: NodeVisitorFunc<ESTree.FunctionExpression>;
  Identifier?: NodeVisitorFunc<ESTree.Identifier>;
  IfStatement?: NodeVisitorFunc<ESTree.IfStatement>;
  ImportDeclaration?: NodeVisitorFunc<ESTree.ImportDeclaration>;
  ImportDefaultSpecifier?: NodeVisitorFunc<ESTree.ImportDefaultSpecifier>;
  ImportExpression?: NodeVisitorFunc<ESTree.ImportExpression>;
  ImportNamespaceSpecifier?: NodeVisitorFunc<ESTree.ImportNamespaceSpecifier>;
  ImportSpecifier?: NodeVisitorFunc<ESTree.ImportSpecifier>;
  LabeledStatement?: NodeVisitorFunc<ESTree.LabeledStatement>;
  Literal?: NodeVisitorFunc<ESTree.Literal>;
  LogicalExpression?: NodeVisitorFunc<ESTree.LogicalExpression>;
  MemberExpression?: NodeVisitorFunc<ESTree.MemberExpression>;
  MetaProperty?: NodeVisitorFunc<ESTree.MetaProperty>;
  MethodDefinition?: NodeVisitorFunc<ESTree.MethodDefinition>;
  NewExpression?: NodeVisitorFunc<ESTree.NewExpression>;
  ObjectExpression?: NodeVisitorFunc<ESTree.ObjectExpression>;
  ObjectPattern?: NodeVisitorFunc<ESTree.ObjectPattern>;
  Program?: NodeVisitorFunc<ESTree.Program>;
  Property?: NodeVisitorFunc<ESTree.Property>;
  RestElement?: NodeVisitorFunc<ESTree.RestElement>;
  ReturnStatement?: NodeVisitorFunc<ESTree.ReturnStatement>;
  SequenceExpression?: NodeVisitorFunc<ESTree.SequenceExpression>;
  SpreadElement?: NodeVisitorFunc<ESTree.SpreadElement>;
  Super?: NodeVisitorFunc<ESTree.Super>;
  SwitchCase?: NodeVisitorFunc<ESTree.SwitchCase>;
  SwitchStatement?: NodeVisitorFunc<ESTree.SwitchStatement>;
  TaggedTemplateExpression?: NodeVisitorFunc<ESTree.TaggedTemplateExpression>;
  TemplateElement?: NodeVisitorFunc<ESTree.TemplateElement>;
  TemplateLiteral?: NodeVisitorFunc<ESTree.TemplateLiteral>;
  ThisExpression?: NodeVisitorFunc<ESTree.ThisExpression>;
  ThrowStatement?: NodeVisitorFunc<ESTree.ThrowStatement>;
  TryStatement?: NodeVisitorFunc<ESTree.TryStatement>;
  UnaryExpression?: NodeVisitorFunc<ESTree.UnaryExpression>;
  UpdateExpression?: NodeVisitorFunc<ESTree.UpdateExpression>;
  VariableDeclaration?: NodeVisitorFunc<ESTree.VariableDeclaration>;
  VariableDeclarator?: NodeVisitorFunc<ESTree.VariableDeclarator>;
  WhileStatement?: NodeVisitorFunc<ESTree.WhileStatement>;
  WithStatement?: NodeVisitorFunc<ESTree.WithStatement>;
  YieldExpression?: NodeVisitorFunc<ESTree.YieldExpression>;
};

export default class Check {
  nodesToVisit: string[] = [];
  cache = new Map<string, CheckerContext>();
  visitor: CheckDescriptor;

  constructor(desc: CheckDescriptor) {
    for (const key of Object.keys(desc)) {
      if (JsNodeNames.has(key)) {
        this.nodesToVisit.push(key);
      }
    }
    this.visitor = desc;
  }
}
