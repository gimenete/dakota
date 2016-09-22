var recast = require('recast')
var types = require('ast-types')
// var n = types.namedTypes
var b = types.builders

exports.findNode = (code, _position) => {
  var position = { row: _position.row + 1, column: _position.column }
  try {
    var ast = recast.parse(code, { range: true })
  } catch (e) {
    console.error('Parsing error', e)
    return null
  }
  var range, output

  const found = (node, transform) => {
    var loc = node.loc
    range = [
      [loc.start.line - 1, loc.start.column],
      [loc.end.line - 1, loc.end.column]
    ]
    var res = transform(node)
    output = typeof res === 'string' ? res : recast.print(res || node).code
  }

  const intersects = (loc) => {
    if (loc.start.line < position.row) {
      if (loc.end.line > position.row) return true
      if (loc.end.line === position.row && loc.end.column >= position.column) return true
    }
    if (loc.start.line === position.row && loc.start.column <= position.column) {
      if (loc.end.line > position.row) return true
      if (loc.end.column >= position.column) return true
    }
    return false
  }

  types.visit(ast, {
    visitArrowFunctionExpression: function (path) {
      var node = path.node
      if (intersects(node.loc)) {
        if (node.body.type !== 'BlockStatement') {
          found(node, () => {
            node.body = b.blockStatement([b.returnStatement(node.body)])
          })
        } else if (node.body.body.length === 1 && node.body.body[0].type === 'ReturnStatement') {
          found(node, () => {
            node.body = node.body.body[0].argument
          })
        }
      }
      this.traverse(path)
    },
    visitTemplateLiteral: function (path) {
      var node = path.node
      if (intersects(node.loc)) {
        found(node, () => {
          var text = code.substring(node.range[0] + 1, node.range[1] - 1)
          return "'" + text + "'"
        })
      }
      this.traverse(path)
    },
    visitLiteral: function (path) {
      var node = path.node
      if (intersects(node.loc)) {
        found(node, () => {
          var text = code.substring(node.range[0] + 1, node.range[1] - 1)
          return '`' + text + '`'
        })
      }
      this.traverse(path)
    }
  })
  return range ? { range, output } : null
}
