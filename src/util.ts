export const ASTNode = {
  ArrayExpression: 'ArrayExpression',
  ArrayPattern: 'ArrayPattern',
  ArrowFunctionExpression: 'ArrowFunctionExpression',
  AssignmentExpression: 'AssignmentExpression',
  AssignmentPattern: 'AssignmentPattern',
  AwaitExpression: 'AwaitExpression',
  BinaryExpression: 'BinaryExpression',
  BlockStatement: 'BlockStatement',
  BreakStatement: 'BreakStatement',
  CallExpression: 'CallExpression',
  CatchClause: 'CatchClause',
  ChainExpression: 'ChainExpression',
  ClassBody: 'ClassBody',
  ClassDeclaration: 'ClassDeclaration',
  ClassExpression: 'ClassExpression',
  ConditionalExpression: 'ConditionalExpression',
  ContinueStatement: 'ContinueStatement',
  DebuggerStatement: 'DebuggerStatement',
  DoWhileStatement: 'DoWhileStatement',
  EmptyStatement: 'EmptyStatement',
  ExportAllDeclaration: 'ExportAllDeclaration',
  ExportDefaultDeclaration: 'ExportDefaultDeclaration',
  ExportNamedDeclaration: 'ExportNamedDeclaration',
  ExportSpecifier: 'ExportSpecifier',
  ExpressionStatement: 'ExpressionStatement',
  ForInStatement: 'ForInStatement',
  ForOfStatement: 'ForOfStatement',
  ForStatement: 'ForStatement',
  FunctionDeclaration: 'FunctionDeclaration',
  FunctionExpression: 'FunctionExpression',
  Identifier: 'Identifier',
  IfStatement: 'IfStatement',
  ImportDeclaration: 'ImportDeclaration',
  ImportDefaultSpecifier: 'ImportDefaultSpecifier',
  ImportExpression: 'ImportExpression',
  ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
  ImportSpecifier: 'ImportSpecifier',
  LabeledStatement: 'LabeledStatement',
  Literal: 'Literal',
  LogicalExpression: 'LogicalExpression',
  MemberExpression: 'MemberExpression',
  MetaProperty: 'MetaProperty',
  MethodDefinition: 'MethodDefinition',
  NewExpression: 'NewExpression',
  ObjectExpression: 'ObjectExpression',
  ObjectPattern: 'ObjectPattern',
  Program: 'Program',
  Property: 'Property',
  RestElement: 'RestElement',
  ReturnStatement: 'ReturnStatement',
  SequenceExpression: 'SequenceExpression',
  SpreadElement: 'SpreadElement',
  Super: 'Super',
  SwitchCase: 'SwitchCase',
  SwitchStatement: 'SwitchStatement',
  TaggedTemplateExpression: 'TaggedTemplateExpression',
  TemplateElement: 'TemplateElement',
  TemplateLiteral: 'TemplateLiteral',
  ThisExpression: 'ThisExpression',
  ThrowStatement: 'ThrowStatement',
  TryStatement: 'TryStatement',
  UnaryExpression: 'UnaryExpression',
  UpdateExpression: 'UpdateExpression',
  VariableDeclaration: 'VariableDeclaration',
  VariableDeclarator: 'VariableDeclarator',
  WhileStatement: 'WhileStatement',
  WithStatement: 'WithStatement',
};

export const JsNodeNames = new Set([
  'ArrayExpression',
  'ArrayPattern',
  'ArrowFunctionExpression',
  'AssignmentExpression',
  'AssignmentPattern',
  'AwaitExpression',
  'BinaryExpression',
  'BlockStatement',
  'BreakStatement',
  'CallExpression',
  'CatchClause',
  'ChainExpression',
  'ClassBody',
  'ClassDeclaration',
  'ClassExpression',
  'ConditionalExpression',
  'ContinueStatement',
  'DebuggerStatement',
  'DoWhileStatement',
  'EmptyStatement',
  'ExportAllDeclaration',
  'ExportDefaultDeclaration',
  'ExportNamedDeclaration',
  'ExportSpecifier',
  'ExpressionStatement',
  'ForInStatement',
  'ForOfStatement',
  'ForStatement',
  'FunctionDeclaration',
  'FunctionExpression',
  'Identifier',
  'IfStatement',
  'ImportDeclaration',
  'ImportDefaultSpecifier',
  'ImportExpression',
  'ImportNamespaceSpecifier',
  'ImportSpecifier',
  'LabeledStatement',
  'Literal',
  'LogicalExpression',
  'MemberExpression',
  'MetaProperty',
  'MethodDefinition',
  'NewExpression',
  'ObjectExpression',
  'ObjectPattern',
  'Program',
  'Property',
  'RestElement',
  'ReturnStatement',
  'SequenceExpression',
  'SpreadElement',
  'Super',
  'SwitchCase',
  'SwitchStatement',
  'TaggedTemplateExpression',
  'TemplateElement',
  'TemplateLiteral',
  'ThisExpression',
  'ThrowStatement',
  'TryStatement',
  'UnaryExpression',
  'UpdateExpression',
  'VariableDeclaration',
  'VariableDeclarator',
  'WhileStatement',
  'WithStatement',
]);

export function assert<T>(value: T, msg?: string): T {
  msg = msg || 'assertion failed!';
  if (!value) {
    throw new Error(msg);
  }
  return value;
}
