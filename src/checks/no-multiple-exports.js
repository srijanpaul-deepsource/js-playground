const rule = {
  init(cache) {
    cache.set('num_exports', 0);
  },

  AssignmentExpression(context, node) {
    const isIdWithName = (node, name) => {
      return node.type === 'Identifier' && node.name === name;
    }

    const isModuleExport = node => {
      return node.type === 'MemberExpression'
        && isIdWithName(node.object, 'module')
        && isIdWithName(node.property, 'exports');
    }

    if (isModuleExport(node.left)) {
      const numExports = this.cache.get('num_exports') || 1;
      this.cache.set('num_exports', numExports + 1);
      if (numExports > 1) {
        context.report("Avoid having multiple module.exports.")
      }
    }
  }
}

module.exports = rule;
