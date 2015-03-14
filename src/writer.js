var Application = require("substance-application");
var Component = Application.Component;
var $$ = Application.$$;
var _ = require("underscore");

// Static sub components
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

  this.getPanels = function() {
    var extensions = this.props.config.extensions;
    var panels = [];

    for (var i = 0; i < extensions.length; i++) {
      var ext = extensions[i];
      panels = panels.concat(ext.panels);
    }
    return panels;
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

  // TODO: use getPanels() helper
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

  // Create a new panel based on current state
  // ----------------

  this.createContextPanel = function() {
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

    // Returns element defintion, including data pulled from reserved `panelData` data bucket
    return $$(panelClass, this.panelData[contextId]);
  };

  
  // Rendering
  // ----------------

  this.createContextToggles = function() {
    var panels = this.getPanels();
    var contextId = this.state.contextId;

    var panelComps = panels.map(function(panelClass) {
      var className = ["toggle-context"];
      if (panelClass.contextId === contextId) {
        className.push("active");
      }

      return $$('a', {
        className: className.join(" "),
        href: "#",
        "data-id": panelClass.contextId,
        html: '<i class="fa '+panelClass.icon+'"></i> '+panelClass.panelName
      });
    });

    return $$('div', {className: "context-toggles"},
      panelComps
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