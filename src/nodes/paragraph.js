var Application = require("substance-application");
var Component = Application.Component;
var $$ = Application.$$;
var _ = require("underscore");

// Paragraph
// ----------------

var Paragraph = function(props) {
  Component.call(this, props);
};

Paragraph.Prototype = function() {

  this.render = function() {
    return $$("p", {html: this.props.node.content});
  };
};

Paragraph.Prototype.prototype = Component.prototype;
Paragraph.prototype = new Paragraph.Prototype();

module.exports = Paragraph;