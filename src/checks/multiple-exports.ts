import { Node } from 'estree';
import { CheckDescriptor } from '../check';

const rule: CheckDescriptor = {
  cache: { numExports: 0 },

  AssignmentExpression(context, node) {
    const isIdWithName = (node: Node, name: string) => {
      return node.type === 'Identifier' && node.name === name;
    };

    const isModuleExport = (node: Node) => {
      return (
        node.type === 'MemberExpression' &&
        isIdWithName(node.object, 'module') &&
        isIdWithName(node.property, 'exports')
      );
    };

    if (isModuleExport(node.left)) {
      this.cache.numExports++;
      if (this.cache.numExports > 1) {
        context.report({
          message: 'Avoid having multiple exports.',
          loc: node.loc,
        });
      }
    }
  },
};

module.exports = rule;
