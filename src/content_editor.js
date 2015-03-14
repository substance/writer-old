var Application = require("substance-application");
var Component = Application.Component;
var $$ = Application.$$;
var _ = require("underscore");

// The Content Panel
// ----------------

var RichtextEditor = function(props) {
  Component.call(this, props);
};

RichtextEditor.Prototype = function() {

  this.render = function() {
    return $$("div", {className: "richtext-editor-component"},
      $$('div', {className: "nodes", text: "RICHEXT EDITOR"})
    );
  };
};

RichtextEditor.Prototype.prototype = Component.prototype;
RichtextEditor.prototype = new RichtextEditor.Prototype();

module.exports = RichtextEditor;