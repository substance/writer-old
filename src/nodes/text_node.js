var Application = require("substance-application");
var Component = Application.Component;
var $$ = Application.$$;
var _ = require("underscore");

// TextNode
// ----------------
// 
// This should go into an extension too

var TextNode = function(props) {
  Component.call(this, props);
};

TextNode.Prototype = function() {

  this.render = function() {
    return $$("div", {className: "content-node text", html: this.props.node.content});
  };
};

TextNode.Prototype.prototype = Component.prototype;
TextNode.prototype = new TextNode.Prototype();

module.exports = TextNode;