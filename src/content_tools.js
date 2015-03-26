var Application = require("substance-application");
var Component = Application.Component;
var $$ = React.createElement;

var _ = require("underscore");

// The Content Panel
// ----------------

var ContentTools = React.createClass({
  displayName: "ContentTools",
  render: function() {
    var tools = this.props.writer.getTools();
    var props = {
      writer: this.props.writer,
      doc: this.props.doc,
      switchContext: this.props.switchContext
    };

    var toolComps = tools.map(function(tool, index) {
      props.key = index;
      return $$(tool, props);
    });

    return $$("div", {className: "content-tools-component"},
      $$('div', {className: "tools"},
        toolComps
      )
    );
  }
});

module.exports = ContentTools;