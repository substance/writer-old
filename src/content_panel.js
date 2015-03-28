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
    var writer = this.props.writer;

    return $$("div", {className: "panel content-panel-component"}, // usually absolutely positioned
      $$(Scrollbar, {
        id: "content-scrollbar",
        contextId: writer.state.contextId,
        highlights: writer.getHighlightedNodes(),
        ref: "scrollbar"
      }),
      $$('div', {className: "panel-content", ref: "panelContent"}, // requires absolute positioning, overflow=auto
        this.getContentEditor()
      )
    );
  }
});

module.exports = ContentPanel;