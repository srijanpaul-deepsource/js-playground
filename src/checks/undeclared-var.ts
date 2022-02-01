import { CheckDescriptor } from "../check";

const check: CheckDescriptor = {
  cache: {},
  Identifier(context, node) {
    const scope = context.getScope(node);
    if (!scope) return;
    const resolvedVar = context.getVariableByName(node.name, scope);
    if (!resolvedVar) {
      console.log(node.name);
    }
  }
}

module.exports = check;