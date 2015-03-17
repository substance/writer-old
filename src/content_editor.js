var Application = require("substance-application");
var Component = Application.Component;
var $$ = Application.$$;
var _ = require("underscore");

var TextNode = require("./nodes/text_node");

// The Content Panel
// ----------------

var ContentEditor = function(props) {
  Component.call(this, props);

};

ContentEditor.Prototype = function() {

  this.render = function() {
  	var doc = this.props.doc;
  	var contentNodes = doc.get("content").nodes;

  	var contentComps = contentNodes.map(function(nodeId) {
  		var node = doc.get(nodeId);
  		return $$(TextNode, {node: node});
  	});

    return $$("div", {className: "content-editor-component"},
      $$('div', {className: "nodes"}, contentComps)
    );
  };
};

ContentEditor.Prototype.prototype = Component.prototype;
ContentEditor.prototype = new ContentEditor.Prototype();

module.exports = ContentEditor;