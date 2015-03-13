var Application = require("substance-application");
var Component = Application.Component;
var $$ = Application.$$;
var _ = require("underscore");

// Sub components
var Paragraph = require("./nodes/paragraph");

// The Content Panel
// ----------------

var ContentPanel = function(props) {
  Component.call(this, props);
};

ContentPanel.Prototype = function() {

  this.render = function() {
    return $$("div", {className: "content-panel-component"},
      $$("div", {className: "nodes"},
        $$(Paragraph, {className: "paragraph", node: this.props.doc[0], ref: "p1"}),
        $$(Paragraph, {className: "paragraph", node: this.props.doc[1], ref: "p2"}),
        $$(Paragraph, {className: "paragraph", node: this.props.doc[2], ref: "p3"})
      )
    );
  };
};

ContentPanel.Prototype.prototype = Component.prototype;
ContentPanel.prototype = new ContentPanel.Prototype();

module.exports = ContentPanel;