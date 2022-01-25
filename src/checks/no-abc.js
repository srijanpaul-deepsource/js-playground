module.exports = {
  Literal(context, node) {
    if (node.value === 'abc') {
      isContext.report({
        message: "Don't use the string 'abc'.",
        loc: node.loc
      })
    }
  }
}
