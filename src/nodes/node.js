var Application = require("substance-application");
var Component = Application.Component;
var $$ = Application.$$;

var Node = function(props) {
  Component.call(this, props);
};

Node.Prototype = function() {

  this.getDocument = function() {
    return this.props.doc;
  };

  this.getNode = function() {
    console.log('getting node', this.props);
    return this.props.node;
  };
};

Node.Prototype.prototype = Component.prototype;
Node.prototype = new Node.Prototype();

module.exports = Node;
