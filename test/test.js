/* global describe it */
var assert = require('assert')
var dakota = require('../lib/dakota')

describe('Dakota', () => {
  it('should not find anything', () => {
    var code = 'var foo = "foo"'
    var info = dakota.findNode(code, { row: 0, column: 1 })
    assert.equal(info, null)
  })

  it('should not find anything if position is out of any possible transform', () => {
    var code = 'const foo = () => console.log("foo")'
    var info = dakota.findNode(code, { row: 0, column: 1 })
    assert.equal(info, null)
  })

  it('should transform an arrow function with a call expression only to one with a block statement', () => {
    var code = 'const foo = () => console.log("foo")'
    var info = dakota.findNode(code, { row: 0, column: 15 })
    assert.deepEqual(info.range, [[0, 12], [0, 36]])
    assert.equal(info.output, '() => {\n  return console.log("foo");\n}')
  })

  it('should transform a function with a block statement with only a return statement to one with a call statement', () => {
    var code = 'const foo = () => {\n  return "foo"\n}'
    var info = dakota.findNode(code, { row: 0, column: 15 })
    assert.deepEqual(info.range, [[0, 12], [2, 1]])
    assert.equal(info.output, '() => "foo"')
  })

  it('should transform a template string into a literal', () => {
    var code = 'console.log(`Hello ${foo} world`)' // eslint-disable-line
    var info = dakota.findNode(code, { row: 0, column: 15 })
    assert.deepEqual(info.range, [[0, 12], [0, 32]])
    assert.equal(info.output, "'Hello ${foo} world'") // eslint-disable-line
  })

  it('should transform a literal into a template string', () => {
    var code = 'console.log("Hello ${foo} world")' // eslint-disable-line
    var info = dakota.findNode(code, { row: 0, column: 15 })
    assert.deepEqual(info.range, [[0, 12], [0, 32]])
    assert.equal(info.output, '`Hello ${foo} world`') // eslint-disable-line
  })
})
