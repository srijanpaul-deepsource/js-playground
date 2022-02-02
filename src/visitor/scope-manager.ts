import { Node } from 'estree';
import { Scope } from './scope';
const escope = require('escope');

export type ESCopeOptions = {
  optimistic?: boolean;
  directive?: boolean;
  // whether to check 'eval()' calls `false` by default.
  ignoreEval?: boolean;
  // whether the whole script is executed under node.js environment. When enabled, escope adds
  // a function scope immediately following the global scope.
  nodejsScope?: boolean;
  impliedStrict?: boolean;
  sourceType?: 'script' | 'module';
  // which ECMAScript version is considered
  ecmaVersion?: number;
  childVisitorKeys?: Object;
  fallback?: 'iteration';
};

export function analyzeScope(ast: Node, options: ESCopeOptions): Scope.ScopeManager {
  options.ecmaVersion = 13;
  return escope.analyze(ast, options);
}
