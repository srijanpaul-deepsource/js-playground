class ASTVisitor {
  // @param {Check[]} checks List of check classes to use
  constructor(checks) {
    this.checks = checks || [];
    for (const check of this.checks) {
      this.addRule(check);
    }

    // TODO (@injuly): replace with a more defined VisitorContext.
    this.context = { report: console.log };

    // @brief `checksForNodeType[x]` returns a list of all checks that are
    // concerned with the node type `x`.
    this.checksForNodeType = {};
  }

  // @param {Check} check A check to add
  addCheck(check) {
    for (const nodeName of check.nodesToVisit) {
      if (!this.checksForNodeType[nodeName]) {
        this.checksForNodeType[nodeName] = [];
      }
      this.checksForNodeType[nodeName].push(check);
    }
  }

  // @param {Node|undefined} node An AST Node
  visit(node) {
    if (!node) return;

    const { type } = node;
    // 1. Look for all rules that are concerned with this node type
    // and call them.
    const checksForNode = this.checksForNodeType[type];
    if (checksForNode) {
      for (const check of checksForNode) {
        check[type](this.context, node);
      }
    }

    // 2. Call the visitor's own function for this node type.
    // TODO (injuly): Once all the nodes are covered in our visitor,
    // this `if` statement should be replaced with an assertion.
    if (this[type]) {
      this[type](node);
    }
  }

  Program(node) {
    for (const stat of node.body) {
      this.visit(stat);
    }
  }

  VariableDeclaration(node) {
    for (const decl of node.declarations) {
      this.visit(decl);
    }
  }

  VariableDeclarator(node) {
    this.visit(node.id);
    this.visit(node.init);
  }

  ArrayExpression(node) {
    for (const el of node.elements) {
      this.visit(el);
    }
  }

  BlockStatement(node) {
    for (const stat of node.body) {
      this.visit(stat);
    }
  }

  ExpressionStatement(node) {
    this.visit(node.expression);
  }

  AssignmentExpression(node) {
    this.visit(node.left);
    this.visit(node.right);
  }

  MemberExpression(node) {
    this.visit(node.object);
    this.visit(node.property);
  }

  ObjectExpression(node) {
    for (const property of node.properties) {
      this.visit(property);
    }
  }

  Property(node) {
    this.visit(node.key);
    this.visit(node.value);
  }

  CallExpression(node) {
    this.visit(node.callee);
    for (const arg of node.arguments) {
      this.visit(arg);
    }
  }
}

module.exports = ASTVisitor;
