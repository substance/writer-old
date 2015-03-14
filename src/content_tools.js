var Application = require("substance-application");
var Component = Application.Component;
var $$ = Application.$$;
var _ = require("underscore");

// The Content Panel
// ----------------

var ContentTools = function(props) {
  Component.call(this, props);
};

ContentTools.Prototype = function() {

  this.render = function() {
    var tools = this.props.writer.getTools();
    var props = this.props;

    var toolComps = tools.map(function(tool, index) {
      return $$(tool, props);
    });

    return $$("div", {className: "content-tools-component"},
      $$('div', {className: "tools"},
        toolComps
      )
    );
  };
};

ContentTools.Prototype.prototype = Component.prototype;
ContentTools.prototype = new ContentTools.Prototype();

module.exports = ContentTools;