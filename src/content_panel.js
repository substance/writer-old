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

  this.events = {
    // "scroll .panel-content": "_onScroll",
    "scroll .panel-content": "_onScroll"
  };

  this._onScroll = function(e) {
    console.log('panel scroll');
  };

  // $(self.panelContentEl).on('scroll', _.bind(self.update, self));

  // Returns true when properties have changed and re-render is needed
  this.shouldComponentUpdate = function(nextProps, nextState) {
    // always re-render for now
    // TODO: make smarter
    return false;
  };

  // Since this component gets only rendered once we can easily bind to this.refs.panelContent
  this.componentDidRender = function() {
    console.log('ContentPanel did render', this.refs.panelContent);
    
    // self.panelContentEl = $(self.props.panel.el).find('.panel-content')[0];
  };

  this.componentDidMount = function() {
    // self.panelContentEl = $(self.props.panel.el).find('.panel-content')[0];
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
        ref: "scrollbar",
        panel: this // scrollbar needs to read from panel
      }),
      $$('div', {className: "panel-content", ref: "panelContent"}, // requires absolute positioning, overflow=auto
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