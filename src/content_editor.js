var Application = require("substance-application");
var ContainerComponent = require('./nodes/container_node');
var $$ = Application.$$;
var _ = require("underscore");

var TextNode = require("./nodes/text_node");


// The Content Editor
// ----------------

var ContentEditor = function(props) {
  ContainerComponent.call(this, props);
};

ContentEditor.Prototype = function() {
  this.shouldComponentUpdate = function(nextProps, nextState) {
    // never re-render for now
    // editor receives updates by binding to document operations
    return false;
  };
};

ContentEditor.persistent = true;


ContentEditor.Prototype.prototype = ContainerComponent.prototype;
ContentEditor.prototype = new ContentEditor.Prototype();

module.exports = ContentEditor;