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
  this.checkDirty = function(oldProps, props) {
    // never re-render for now ;)
    return false;
  };
};

ContentEditor.persistent = true;


ContentEditor.Prototype.prototype = ContainerComponent.prototype;
ContentEditor.prototype = new ContentEditor.Prototype();

module.exports = ContentEditor;