var Application = require("substance-application");
var Panel = require("./panel");
var $$ = Application.$$;
var _ = require("underscore");

var ContentEditor = require("./content_editor");
var Scrollbar = require("./scrollbar");

// Conforms to Panel API
// ----------------

var ContentPanel = function(props) {
  Panel.call(this, props);
};

ContentPanel.Prototype = function() {

  // Returns true when properties have changed and re-render is needed
  this.shouldComponentUpdate = function(nextProps, nextState) {
    // always re-render for now
    // TODO: make smarter
    return true;
  };

  this.componentDidMount = function() {

  };

  // Based on a certain writer state, determine what should be
  // highlighted in the scrollbar. Maybe we need to create custom
  // handlers for highlights in extensions, since there's no
  // general way of determining the highlights

  this.getHighlightedNodes = function() {
    // one specific example implemenation
    // var entityId = this.props.writer.state.entityId;
    // return doc.getIndex('references').get(entityId);
    return ["subject_reference_1", "subject_reference_2"];
  },

  // This is the default rendering of a panel
  // Custom panels must have the exact same structure
  this.render = function() {
    return $$("div", {className: "panel content-panel-component"}, // usually absolutely positioned
      $$(Scrollbar, {
        id: "content-scrollbar",
        highlights: this.getHighlightedNodes(),
        panel: this // scrollbar needs to read from panel
      }),
      $$('div', {className: "panel-content"}, // requires absolute positioning, overflow=auto
        $$(ContentEditor, {
          writer: this.props.writer,
          doc: this.props.doc,
          name: 'content',
          id: "content-editor"
        })
      )
    )
  };
};

// Should a panel be persistent by default?
Panel.persistent = true;

ContentPanel.Prototype.prototype = Panel.prototype;
ContentPanel.prototype = new ContentPanel.Prototype();

module.exports = ContentPanel;