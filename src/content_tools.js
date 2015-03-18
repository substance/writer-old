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

  // Returns true when properties have changed and re-render is needed
  this.checkDirty = function(oldProps, props) {
    // never re-render for now ;)
    return false;
  };

  this.render = function() {
    var tools = this.props.writer.getTools();
    var props = {
      writer: this.props.writer,
      doc: this.props.doc,
      switchContext: this.props.switchContext
    };

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

ContentTools.persistent = true;

ContentTools.Prototype.prototype = Component.prototype;
ContentTools.prototype = new ContentTools.Prototype();

module.exports = ContentTools;