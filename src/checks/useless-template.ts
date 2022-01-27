import { CheckDescriptor } from "../check";

const rule: CheckDescriptor = {
  cache: {},
  TemplateLiteral(context, node) {
    if (node.expressions.length == 0) {
      const quasis = node.quasis[0]
      if (quasis.type === 'TemplateElement' && !quasis.value.raw.includes('\n')) {
        context.report({
          message: "Useless template literal. Use string instead.",
          loc: node.loc
        })
      }
    }
  }
}

module.exports = rule;
