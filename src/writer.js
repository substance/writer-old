var $$ = React.createElement;
var _ = require("underscore");

// Static sub components
var ContentTools = require("./content_tools");
var ContentPanel = require("./content_panel");


// The Substance Writer Component
// ----------------

var Writer = React.createClass({
  displayName: "Writer",

  getNodeComponentClass: function(nodeType) {
    var extensions = this.props.config.extensions;
    var NodeClass;

    for (var i = 0; i < extensions.length; i++) {
      var ext = extensions[i];
      if (ext.nodes[nodeType]) NodeClass = ext.nodes[nodeType];
    }

    if (!NodeClass) throw new Error("No component found for "+nodeType);
    return NodeClass;
  },

  getPanels: function() {
    var extensions = this.props.config.extensions;
    var panels = [];

    for (var i = 0; i < extensions.length; i++) {
      var ext = extensions[i];
      panels = panels.concat(ext.panels);
    }
    return panels;
  },

  // Get all available tools from extensions
  getTools: function() {
    var extensions = this.props.config.extensions;
    var tools = [];

    for (var i = 0; i < extensions.length; i++) {
      var ext = extensions[i];
      if (ext.tools) {
        tools = tools.concat(ext.tools);
      }
    }
    return tools;
  },


  getReferenceHandlers: function() {
    var extensions = this.props.config.extensions;
    var refHandlers = [];

    for (var i = 0; i < extensions.length; i++) {
      var ext = extensions[i];
      if (ext.referenceHandler) {
        refHandlers.push(ext.referenceHandler);
      }
    }

    return refHandlers;
  },


  getInitialState: function() {
    return {"contextId": "subjects", "subjectId": "54bae4cda868bc6fab4bcd0e"};
  },

  // Events
  // ----------------

  componentDidMount: function() {
    // 'click .annotation': '_toggleReference'
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

  handleReferenceToggle: function(e) {
    e.preventDefault();

    console.log('handling reference toggle');
    var referenceId = $(e.currentTarget).attr("data-id");
    var reference = this.props.doc.get(referenceId);
    var newState = null;

    var refHandlers = this.getReferenceHandlers();
    for (var i = 0; i < refHandlers.length && !newState; i++) {
      var handler = refHandlers[i];
      newState = handler(this, reference);
    }

    if (newState) {
      this.setState(newState);
    } else {
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
        dangerouslySetInnerHTML: {__html: '<i class="fa '+panelClass.icon+'"></i> '+panelClass.panelName}
      });
    });

    return $$('div', {className: "context-toggles"},
      _.compact(panelComps)
    );
  },

  // Create a new panel based on current writer state (contextId)
  createContextPanel: function() {

    var panels = this.getPanels();
    var contextId = this.state.contextId;
    var panelClass = null;

    for (var i = 0; i < panels.length && !panelClass; i++) {
      var panel = panels[i];
      if (contextId === panel.contextId) {
        panelClass = panel;
      }
    }

    if (!panelClass) {
      throw new Error("No panel found for ", contextId);
    }

    // Let the panel create an element, where props are derived from
    // writer state
    return panelClass.create(this);
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