var $$ = React.createElement;
var _ = require("underscore");

var Scrollbar = require("./scrollbar");

var ContentPanel = React.createClass({
  displayName: "ContentPanel",

  // Since component gets rendered multiple times we need to update
  // the scrollbar and reattach the scroll event
  componentDidMount: function() {
    this.updateScrollbar();
  },

  componentDidUpdate: function() {
    this.updateScrollbar();
  },

  updateScrollbar: function() {
    var scrollbar = this.refs.scrollbar;
    var panelContentEl = this.refs.panelContent.getDOMNode();

    // We need to await next repaint, otherwise dimensions will be wrong
    _.delay(function() {
      scrollbar.update(panelContentEl);  
    },0);

    // (Re)-Bind scroll event on new panelContentEl
    $(panelContentEl).off('scroll');
    $(panelContentEl).on('scroll', _.bind(this._onScroll, this));
  },

  _onScroll: function(e) {
    var panelContentEl = this.refs.panelContent.getDOMNode();
    this.refs.scrollbar.update(panelContentEl);
  },

  // Based on a certain writer state, determine what should be
  // highlighted in the scrollbar. Maybe we need to create custom
  // handlers for highlights in extensions, since there's no
  // general way of determining the highlights

  getHighlightedNodes: function() {
    var doc = this.props.doc;
    var writerState = this.props.writer.state;

    // This needs to be passed as a prop!
    var target = writerState.entityId || writerState.subjectId;

    console.log('TARGET', target);

    var references = [];
    if (target) {
      // Get references for a particular target
      references = Object.keys(doc.references.get(target));
    }
    return references;
  },

  // Rendering
  // -----------------

  getContentEditor: function() {
    var writer = this.props.writer;
    var doc = this.props.doc;
    var ContainerClass = writer.getNodeComponentClass("container");

    return $$(ContainerClass, {
      writer: writer,
      doc: doc,
      node: doc.get("content")
    });
  },

  render: function() {
    console.log('ContentPanel.render called');

    return $$("div", {className: "panel content-panel-component"}, // usually absolutely positioned
      $$(Scrollbar, {
        id: "content-scrollbar",
        highlights: this.getHighlightedNodes(),
        ref: "scrollbar"
      }),
      $$('div', {className: "panel-content", ref: "panelContent"}, // requires absolute positioning, overflow=auto
        this.getContentEditor()
      )
    );
  }
});

module.exports = ContentPanel;