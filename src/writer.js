/* global $ */
var $$ = React.createElement;

var Substance = require("substance");
var ContentTools = require("./content_tools");
var ContentPanel = require("./content_panel");
var WriterController = require("./writer_controller");

// The Substance Writer Component
// ----------------

var Writer = React.createClass({
  displayName: "Writer",

  contextTypes: {
    backend: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
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


  shouldComponentUpdate: function(nextProps, nextState) {
    if (Substance.isEqual(this.state, nextState)) {
      return false;
    }
    return true;
  },

  componentDidMount: function() {
    // setInterval(function() {
    //   this.requestAutoSave();
    // }.bind(this), 2000);
  },

  requestAutoSave: function() {
    var doc = this.props.doc;
    var self = this;
    var backend = this.context.backend;

    console.log('autosaving... doc is dirty:', doc.__dirty);

    if (doc.__dirty && !doc.__isSaving) {
      console.log('autosaving doc');
      doc.__isSaving = true;
      backend.saveDocument(doc, function(err) {
        doc.__isSaving = false;
        if (err) {
          console.err('saving of document failed');
        } else {
          doc.__dirty = false;
        }
      });
    }
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

  // Rendering
  // ----------------

  // Toggles for explicitly switching between context panels
  createContextToggles: function() {
    var panels = this.writerCtrl.getPanels();
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
      Substance.compact(panelComps)
    );
  },

  // Create a new panel based on current writer state (contextId)
  createContextPanel: function() {
    var contextId = this.state.contextId;
    var panelElement = null;
    var modules = this.writerCtrl.getModules();

    for (var i = 0; i < modules.length && !panelElement; i++) {
      var stateHandlers = modules[i].stateHandlers;
      if (stateHandlers && stateHandlers.handleContextPanelCreation) {
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
          writerCtrl: this.writerCtrl
        }),
        $$(ContentPanel, {
          writerCtrl: this.writerCtrl,
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