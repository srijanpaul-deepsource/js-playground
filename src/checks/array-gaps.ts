import { CheckDescriptor } from '../check';

const rule: CheckDescriptor = {
  cache: {},
  ArrayExpression(context, node) {
    for (const el of node.elements) {
      if (el === null) {
        const { loc } = node;
        if (!loc) return;
        return context.report({
          message: `Avoid having gaps in arrays.`,
          loc,
        });
      }
    }
  },
};

module.exports = rule;
