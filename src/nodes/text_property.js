var Application = require("substance-application");
var Component = Application.Component;
var $$ = Application.$$;
var _ = require("underscore");

// TextProperty
// ----------------
//

var TextProperty = function(props) {
  Component.call(this, props);
  if(!props.doc || !props.path) {
    throw new Error('Illegal arguments: need "doc" and "path".');
  }
};

TextProperty.Prototype = function() {

  this.getPath = function() {
    return this.props.path;
  };

  this.render = function() {
    var text = this.getDocument().get(this.getPath());
    return $$(this.props.tagName || "div", {className: "text-property", html: text});
  };

};

TextProperty.Prototype.prototype = Component.prototype;
TextProperty.prototype = new TextProperty.Prototype();

module.exports = TextProperty;
