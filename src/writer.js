/* global $ */
var $$ = React.createElement;
var _ = require("underscore");

var ContentTools = require("./content_tools");
var ContentPanel = require("./content_panel");
var WriterController = require("./writer_controller");

// The Substance Writer Component
// ----------------

var Writer = React.createClass({
  displayName: "Writer",

  getInitialState: function() {
    console.log('getInitialState');
    return {"contextId": "subjects"};
  },

  // Events
  // ----------------

  componentWillMount: function() {
    // Initialize writer controller, which will serve as a common interface
    // for custom modules
    this.writerCtrl = new WriterController({
      doc: this.props.doc,
      writerComponent: this,
      config: this.props.config
    });
  },

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

    var modules = this.writerCtrl.getModules();
    var handled = false;
    for (var i = 0; i < modules.length && !handled; i++) {
      var stateHandlers = modules[i].stateHandlers;
      if (stateHandlers) {
        handled = stateHandlers.handleReferenceToggle(this.writerCtrl, reference);
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
    var panels = this.ctrl.getPanels();
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
    var panelElement = null;
    var modules = this.ctrl.getModules();

    for (var i = 0; i < modules.length && !panelElement; i++) {
      var stateHandlers = modules[i].stateHandlers;
      if (stateHandlers) {
        panelElement = stateHandlers.handleContextPanelCreation(this.writerCtrl);
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
          writerCtrl: this.ctrl,
          switchContext: _.bind(this.handleContextSwitch, this)
        }),
        $$(ContentPanel, {
          writerCtrl: this.ctrl,
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