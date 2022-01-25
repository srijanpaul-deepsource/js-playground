import ESTree from 'estree';
import JsNodeNames from './util';

export type CheckDescriptor = {
  cache: Record<string, any>;
  init?: () => void;
  ArrayExpression?: (context: any, node: ESTree.ArrayExpression & ESTree.BaseNode) => void;
  ArrayPattern?: (context: any, node: ESTree.ArrayPattern & ESTree.BaseNode) => void;
  ArrowFunctionExpression?: (context: any, node: ESTree.ArrowFunctionExpression & ESTree.BaseNode) => void;
  AssignmentExpression?: (context: any, node: ESTree.AssignmentExpression & ESTree.BaseNode) => void;
  AssignmentPattern?: (context: any, node: ESTree.AssignmentPattern & ESTree.BaseNode) => void;
  AwaitExpression?: (context: any, node: ESTree.AwaitExpression & ESTree.BaseNode) => void;
  BinaryExpression?: (context: any, node: ESTree.BinaryExpression & ESTree.BaseNode) => void;
  BlockStatement?: (context: any, node: ESTree.BlockStatement & ESTree.BaseNode) => void;
  BreakStatement?: (context: any, node: ESTree.BreakStatement & ESTree.BaseNode) => void;
  CallExpression?: (context: any, node: ESTree.CallExpression & ESTree.BaseNode) => void;
  CatchClause?: (context: any, node: ESTree.CatchClause & ESTree.BaseNode) => void;
  ChainExpression?: (context: any, node: ESTree.ChainExpression & ESTree.BaseNode) => void;
  ClassBody?: (context: any, node: ESTree.ClassBody & ESTree.BaseNode) => void;
  ClassDeclaration?: (context: any, node: ESTree.ClassDeclaration & ESTree.BaseNode) => void;
  ClassExpression?: (context: any, node: ESTree.ClassExpression & ESTree.BaseNode) => void;
  ConditionalExpression?: (context: any, node: ESTree.ConditionalExpression & ESTree.BaseNode) => void;
  ContinueStatement?: (context: any, node: ESTree.ContinueStatement & ESTree.BaseNode) => void;
  DebuggerStatement?: (context: any, node: ESTree.DebuggerStatement & ESTree.BaseNode) => void;
  DoWhileStatement?: (context: any, node: ESTree.DoWhileStatement & ESTree.BaseNode) => void;
  EmptyStatement?: (context: any, node: ESTree.EmptyStatement & ESTree.BaseNode) => void;
  ExportAllDeclaration?: (context: any, node: ESTree.ExportAllDeclaration & ESTree.BaseNode) => void;
  ExportDefaultDeclaration?: (context: any, node: ESTree.ExportDefaultDeclaration & ESTree.BaseNode) => void;
  ExportNamedDeclaration?: (context: any, node: ESTree.ExportNamedDeclaration & ESTree.BaseNode) => void;
  ExportSpecifier?: (context: any, node: ESTree.ExportSpecifier & ESTree.BaseNode) => void;
  ExpressionStatement?: (context: any, node: ESTree.ExpressionStatement & ESTree.BaseNode) => void;
  ForInStatement?: (context: any, node: ESTree.ForInStatement & ESTree.BaseNode) => void;
  ForOfStatement?: (context: any, node: ESTree.ForOfStatement & ESTree.BaseNode) => void;
  ForStatement?: (context: any, node: ESTree.ForStatement & ESTree.BaseNode) => void;
  FunctionDeclaration?: (context: any, node: ESTree.FunctionDeclaration & ESTree.BaseNode) => void;
  FunctionExpression?: (context: any, node: ESTree.FunctionExpression & ESTree.BaseNode) => void;
  Identifier?: (context: any, node: ESTree.Identifier & ESTree.BaseNode) => void;
  IfStatement?: (context: any, node: ESTree.IfStatement & ESTree.BaseNode) => void;
  ImportDeclaration?: (context: any, node: ESTree.ImportDeclaration & ESTree.BaseNode) => void;
  ImportDefaultSpecifier?: (context: any, node: ESTree.ImportDefaultSpecifier & ESTree.BaseNode) => void;
  ImportExpression?: (context: any, node: ESTree.ImportExpression & ESTree.BaseNode) => void;
  ImportNamespaceSpecifier?: (context: any, node: ESTree.ImportNamespaceSpecifier & ESTree.BaseNode) => void;
  ImportSpecifier?: (context: any, node: ESTree.ImportSpecifier & ESTree.BaseNode) => void;
  LabeledStatement?: (context: any, node: ESTree.LabeledStatement & ESTree.BaseNode) => void;
  Literal?: (context: any, node: ESTree.Literal & ESTree.BaseNode) => void;
  LogicalExpression?: (context: any, node: ESTree.LogicalExpression & ESTree.BaseNode) => void;
  MemberExpression?: (context: any, node: ESTree.MemberExpression & ESTree.BaseNode) => void;
  MetaProperty?: (context: any, node: ESTree.MetaProperty & ESTree.BaseNode) => void;
  MethodDefinition?: (context: any, node: ESTree.MethodDefinition & ESTree.BaseNode) => void;
  NewExpression?: (context: any, node: ESTree.NewExpression & ESTree.BaseNode) => void;
  ObjectExpression?: (context: any, node: ESTree.ObjectExpression & ESTree.BaseNode) => void;
  ObjectPattern?: (context: any, node: ESTree.ObjectPattern & ESTree.BaseNode) => void;
  Program?: (context: any, node: ESTree.Program & ESTree.BaseNode) => void;
  Property?: (context: any, node: ESTree.Property & ESTree.BaseNode) => void;
  RestElement?: (context: any, node: ESTree.RestElement & ESTree.BaseNode) => void;
  ReturnStatement?: (context: any, node: ESTree.ReturnStatement & ESTree.BaseNode) => void;
  SequenceExpression?: (context: any, node: ESTree.SequenceExpression & ESTree.BaseNode) => void;
  SpreadElement?: (context: any, node: ESTree.SpreadElement & ESTree.BaseNode) => void;
  Super?: (context: any, node: ESTree.Super & ESTree.BaseNode) => void;
  SwitchCase?: (context: any, node: ESTree.SwitchCase & ESTree.BaseNode) => void;
  SwitchStatement?: (context: any, node: ESTree.SwitchStatement & ESTree.BaseNode) => void;
  TaggedTemplateExpression?: (context: any, node: ESTree.TaggedTemplateExpression & ESTree.BaseNode) => void;
  TemplateElement?: (context: any, node: ESTree.TemplateElement & ESTree.BaseNode) => void;
  TemplateLiteral?: (context: any, node: ESTree.TemplateLiteral & ESTree.BaseNode) => void;
  ThisExpression?: (context: any, node: ESTree.ThisExpression & ESTree.BaseNode) => void;
  ThrowStatement?: (context: any, node: ESTree.ThrowStatement & ESTree.BaseNode) => void;
  TryStatement?: (context: any, node: ESTree.TryStatement & ESTree.BaseNode) => void;
  UnaryExpression?: (context: any, node: ESTree.UnaryExpression & ESTree.BaseNode) => void;
  UpdateExpression?: (context: any, node: ESTree.UpdateExpression & ESTree.BaseNode) => void;
  VariableDeclaration?: (context: any, node: ESTree.VariableDeclaration & ESTree.BaseNode) => void;
  VariableDeclarator?: (context: any, node: ESTree.VariableDeclarator & ESTree.BaseNode) => void;
  WhileStatement?: (context: any, node: ESTree.WhileStatement & ESTree.BaseNode) => void;
  WithStatement?: (context: any, node: ESTree.WithStatement & ESTree.BaseNode) => void;
  YieldExpression?: (context: any, node: ESTree.YieldExpression & ESTree.BaseNode) => void;
}

export default class Check {
  nodesToVisit: string[] = [];
  cache = new Map<string, any>();
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

