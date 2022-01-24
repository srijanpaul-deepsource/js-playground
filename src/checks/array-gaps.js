const rule = {
  ArrayExpression(context, node) {
    for (const el of node.elements) {
      if (el === null) {
        const { loc } = node;
        return context.report(`Ln ${loc.start.line}, Col ${loc.start.column}: Avoid having gaps in arrays.`);
      }
    }
  }
}

module.exports = rule
