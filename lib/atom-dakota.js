/* global atom */
var dakota = require('./dakota')
var CompositeDisposable = require('atom').CompositeDisposable

module.exports = {
  subscriptions: null,
  activate: function (state) {
    this.subscriptions = new CompositeDisposable()

    return this.subscriptions.add(atom.commands.add('atom-workspace', {
      'dakota:transform': (function (_this) {
        return function () {
          var textEditor = atom.workspace.getActiveTextEditor()
          var position = textEditor.getCursorBufferPosition()
          var code = textEditor.getText()
          var info = dakota.findNode(code, position)
          if (info) {
            textEditor.setTextInBufferRange(info.range, info.output)
            textEditor.setCursorBufferPosition(position)
          }
        }
      })(this)
    }))
  },
  deactivate: function () {
    this.subscriptions.dispose()
  }
}
