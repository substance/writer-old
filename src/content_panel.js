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
    console.log('ContentPanelShouldUpdate');
    return true;
  };

  // Since component gets rendered multiple times we need to update
  // the scrollbar and reattach the scroll event
  this.componentDidRender = function() {
    var scrollbar = this.refs.scrollbar;
    var panelContentEl = this.refs.panelContent;

    // We need to await next repaint, otherwise dimensions will be wrong
    _.delay(function() {
      scrollbar.update(panelContentEl);  
    },0);

    // Bind scroll event on new panelContentEl
    $(panelContentEl).on('scroll', _.bind(this._onScroll, this));
  };

  this._onScroll = function(e) {
    var panelContentEl = this.refs.panelContent;
    this.refs.scrollbar.update(panelContentEl);
  };

  // Based on a certain writer state, determine what should be
  // highlighted in the scrollbar. Maybe we need to create custom
  // handlers for highlights in extensions, since there's no
  // general way of determining the highlights

  this.getHighlightedNodes = function() {
    var doc = this.props.doc;
    var writerState = this.props.writer.state

    // This needs to be passed as a prop!
    var target = writerState.entityId || writerState.subjectId;

    var references = [];
    if (target) {
      // Get references for a particular target
      references = Object.keys(doc.references.get(target));
    }
    return references;
  };

  // Incremental updates instead of rerendering
  // e.g. when highlighted nodes have changed, update the scrollbar
  // this.update = function() {

  // };

  // This is the default rendering of a panel
  // Custom panels must have the exact same structure
  this.render = function() {
    console.log('CONTENTPANEL.render called');

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
ContentPanel.persistent = true;

ContentPanel.Prototype.prototype = Panel.prototype;
ContentPanel.prototype = new ContentPanel.Prototype();

module.exports = ContentPanel;