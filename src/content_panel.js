var Application = require("substance-application");
var Component = Application.Component;
var $$ = Application.$$;
var _ = require("underscore");

var ContentTools = require("./content_tools");
var ContentEditor = require("./content_editor");

// The Content Panel
// ----------------

var ContentPanel = function(props) {
  Component.call(this, props);
};

ContentPanel.Prototype = function() {

  this.render = function() {
    return $$("div", {className: "content-panel-component"},
      // Props are forwarded (doc, writer)
      $$(ContentTools, this.props),
      $$(ContentEditor, this.props)
    );
  };
};

ContentPanel.Prototype.prototype = Component.prototype;
ContentPanel.prototype = new ContentPanel.Prototype();

module.exports = ContentPanel;