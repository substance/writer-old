/* global $ */
var $$ = React.createElement;
var _ = require("underscore");

var ContentTools = require("./content_tools");
var ContentPanel = require("./content_panel");



// The Substance Writer Component
// ----------------

var Writer = React.createClass({
  displayName: "Writer",

  getModules: function() {
    return this.props.config.modules;
  },

  getNodeComponentClass: function(nodeType) {
    var modules = this.props.config.modules;
    var NodeClass;

    for (var i = 0; i < modules.length; i++) {
      var ext = modules[i];
      if (ext.components && ext.components[nodeType]) {
        NodeClass = ext.components[nodeType];
      }
    }

    if (!NodeClass) throw new Error("No component found for "+nodeType);
    return NodeClass;
  },

  getPanels: function() {
    var modules = this.props.config.modules;
    var panels = [];

    for (var i = 0; i < modules.length; i++) {
      var ext = modules[i];
      panels = panels.concat(ext.panels);
    }
    return panels;
  },

  // Get all available tools from modules
  getTools: function() {
    var modules = this.props.config.modules;
    var tools = [];

    for (var i = 0; i < modules.length; i++) {
      var ext = modules[i];
      if (ext.tools) {
        tools = tools.concat(ext.tools);
      }
    }
    return tools;
  },


  // Based on a certain writer state, determine what should be
  // highlighted in the scrollbar. Maybe we need to create custom
  // handlers for highlights in modules, since there's no
  // general way of determining the highlights

  getHighlightedNodes: function() {
    var modules = this.getModules();
    var highlightedNodes = null;
    for (var i = 0; i < modules.length && !highlightedNodes; i++) {
      var stateHandlers = modules[i].stateHandlers;
      if (stateHandlers) {
        highlightedNodes = stateHandlers.getHighlightedNodes(this);
      }
    }
    return highlightedNodes || [];
  },

  getInitialState: function() {
    return {"contextId": "subjects"};
  },

  // Events
  // ----------------

  componentDidMount: function() {
    $(this.getDOMNode()).on('click', '.annotation', this.handleReferenceToggle);
  },

  // E.g. when a tool requests a context switch
  handleContextSwitch: function(contextId) {
    this.replaceState({
      contextId: contextId
    });
  },

  // Triggered by Writer UI
  handleContextToggle: function(e) {
    e.preventDefault();
    var newContext = $(e.currentTarget).attr("data-id");
    this.handleContextSwitch(newContext);
  },

  // Handle click on a reference within the document
  handleReferenceToggle: function(e) {
    e.preventDefault();

    var referenceId = $(e.currentTarget).attr("data-id");
    var reference = this.props.doc.get(referenceId);
    // Skip for non reference toggles
    if (!reference) return;

    var modules = this.getModules();
    var handled = false;
    for (var i = 0; i < modules.length && !handled; i++) {
      var stateHandlers = modules[i].stateHandlers;
      if (stateHandlers) {
        handled = stateHandlers.handleReferenceToggle(this, reference);
      }
    }

    if (!handled) {
      console.error("this reference type could not be handled:", reference.type);
    }
  },

  // Rendering
  // ----------------

  // Toggles for explicitly switching between context panels
  createContextToggles: function() {
    var panels = this.getPanels();
    var contextId = this.state.contextId;
    var self = this;

    var panelComps = panels.map(function(panelClass) {
      // We don't show dialogs here
      if (panelClass.isDialog) return null;

      var className = ["toggle-context"];
      if (panelClass.contextId === contextId) {
        className.push("active");
      }

      return $$('a', {
        className: className.join(" "),
        href: "#",
        key: panelClass.contextId,
        "data-id": panelClass.contextId,
        onClick: self.handleContextToggle,
        dangerouslySetInnerHTML: {__html: '<i class="fa '+panelClass.icon+'"></i> '+panelClass.displayName}
      });
    });

    return $$('div', {className: "context-toggles"},
      _.compact(panelComps)
    );
  },

  // Create a new panel based on current writer state (contextId)
  createContextPanel: function() {
    var contextId = this.state.contextId;
    // var panelClass = null;
    var panelElement = null;
    var modules = this.getModules();

    for (var i = 0; i < modules.length && !panelElement; i++) {
      var stateHandlers = modules[i].stateHandlers;
      if (stateHandlers) {
        panelElement = stateHandlers.handleContextPanelCreation(this);
      }
    }

    if (!panelElement) {
      throw new Error("No panel found for ", contextId);
    }

    return panelElement;
  },

  render: function() {
    return $$('div', {className: 'writer-component'},
      $$('div', {className: "main-container"},
        $$(ContentTools, { // will be reused
          writer: this,
          doc: this.props.doc,
          id: "content-tools",
          switchContext: _.bind(this.handleContextSwitch, this)
        }),
        $$(ContentPanel, {
          writer: this,
          doc: this.props.doc,
        })
      ),
      $$('div', {className: "resource-container"},
        this.createContextToggles(),
        this.createContextPanel(this) // will be possibly be recycled
      )
    );
  }
});

module.exports = Writer;