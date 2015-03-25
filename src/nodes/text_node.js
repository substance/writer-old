var Application = require("substance-application");
var NodeComponent = require('./node');
var $$ = Application.$$;
var _ = require("underscore");

// TextNode
// ----------------
//
// This should go into an extension too

var TextNode = function(props) {
  NodeComponent.call(this, props);
};

TextNode.Prototype = function() {

  this.render = function() {
    return $$("div", {contenteditable: true, className: "content-node text", html: this.getNode().content});
  };

};

TextNode.Prototype.prototype = NodeComponent.prototype;
TextNode.prototype = new TextNode.Prototype();

module.exports = TextNode;
