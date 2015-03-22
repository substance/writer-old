var Application = require("substance-application");
var NodeComponent = require('./node');
var $$ = Application.$$;

var ContainerNode = function(props) {
  NodeComponent.call(this, props);
};

ContainerNode.Prototype = function() {

  this.setProps = function(props) {
    props.node = props.node || props.doc.get(props.name);
    
    NodeComponent.prototype.setProps.call(this, props);
    if (!props.name) {
      throw new Error('Illegal arguments: need "name"');
    }
  };

  this.getName = function() {
    return this.props.name;
  };

  this.render = function() {
    var app = this.app;
    var doc = this.getDocument();

    var components = this.getNode().nodes.map(function(nodeId) {
      var node = doc.get(nodeId);
      var ComponentClass = app.lookupComponentClass(node.type);
      return $$(ComponentClass, {doc: doc, node: node});
    });
    
    return $$("div", {className: "container-node " + this.props.name},
      $$('div', {className: "nodes"}, components)
    );
  };

};

ContainerNode.Prototype.prototype = NodeComponent.prototype;
ContainerNode.prototype = new ContainerNode.Prototype();

module.exports = ContainerNode;
