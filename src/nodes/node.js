var Application = require("substance-application");
var Component = Application.Component;
var $$ = Application.$$;

var Node = function(props) {
  Component.call(this, props);
  if (!props.doc || !props.node) {
    throw new Error('Illegal arguments: need "doc" and "node"');
  }
};

Node.Prototype = function() {

  this.getDocument = function() {
    return this.props.doc;
  };

  this.getNode = function() {
    return this.props.node;
  };

};

Node.Prototype.prototype = Component.prototype;
Node.prototype = new Node.Prototype();

module.exports = Node;
