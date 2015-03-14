var Application = require("substance-application");
var Component = Application.Component;
var $$ = Application.$$;
var _ = require("underscore");

// Sub Components
var ContentPanel = require("./content_panel");

// The Writer Component
// ----------------

var Writer = function(props) {
  Component.call(this, props);

  // A bucket for panel-related data
  this.panelData = {};
};

Writer.Prototype = function() {

  // Utils
  // ----------------  

  // Get all available tools from extensions
  this.getTools = function() {
    var extensions = this.props.config.extensions;
    var tools = [];

    for (var i = 0; i < extensions.length; i++) {
      var ext = extensions[i];
      if (ext.tools) {
        tools = tools.concat(ext.tools);  
      }
    }
    return tools;
  };

  // Events
  // ----------------

  this.componentDidMount = function() {
    $(this.el).on('click', 'a.toggle-context', _.bind(this._toggleContext, this));
  };

  this._toggleContext = function(e) {
    var newContext = $(e.currentTarget).attr("data-id");
    this.setState({
      contextId: newContext
    });
    e.preventDefault();
  };

  this.getInitialState = function() {
    return {"id": "main", "contextId": "entities"};
  };



  this.transition = function(oldState, newState, cb) {
    var extensions = this.props.config.extensions;

    var handled = false;
    // console.log('Writer.transition');

    for (var i = 0; i < extensions.length && !handled; i++) {
      var extension = extensions[i];
      var transitions = extension.transitions;

      // this.handleWriterTransition
      for (var j = 0; j < transitions.length && !handled; j++) {
        var transition = transitions[j];
        handled = transition(this, oldState, newState, cb);
        if (handled) {
          console.log('transition handled by', extension.name, 'extension:', transition);
        }
      }
    }

    if (!handled) {
      cb(null);
    }
  };

  // Create a new panel 

  this.createContextPanel = function() {
    var extensions = this.props.config.extensions;
    var contextId = this.state.contextId;
    var panelClass = null;

    for (var i = 0; i < extensions.length && !panelClass; i++) {
      var extension = extensions[i];
      var panels = extension.panels;

      // this.handleWriterTransition
      for (var j = 0; j < panels.length && !panelClass; j++) {
        var panel = panels[j];
        if (contextId === panel.contextId) {
          panelClass = panel;
        }
      }
    }

    if (!panelClass) {
      throw new Error("No panel found for ", contextId);
    }

    // Returns element defintion, including data pulled from reserved `panelData` data bucket
    return $$(panelClass, this.panelData[contextId]);
  };

  
  // Rendering
  // ----------------

  this.createContextToggles = function() {
    return $$('div', {className: "contexts"},
      // $$('a', {className: "toggle-context", href: "#", "data-id": "toc", text: "Contents"}),
      $$('a', {className: "toggle-context", href: "#", "data-id": "subjects", text: "Subjects"}),
      $$('a', {className: "toggle-context", href: "#", "data-id": "entities", text: "Entities"})
    );
  };

  this.render = function() {
    // until initial transition is performed
    if (this.state.id === "uninitialized") {
      return $$('div', {text: ""});
    }

    return $$('div', {className: 'writer-component'},
      $$('div', {className: "main-container"},
        $$(ContentPanel, {writer: this, doc: this.props.doc, ref: "contentpanel"})
      ),
      $$('div', {className: "resource-container"},
        this.createContextToggles(),
        this.createContextPanel(this)
      )
    );
  };
};

Writer.Prototype.prototype = Component.prototype;
Writer.prototype = new Writer.Prototype();

module.exports = Writer;