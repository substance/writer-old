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
  this.panelData = {
    "entities": ["e1", "e2"],
    "subjects": ["s1", "s2"]
  };
};

Writer.Prototype = function() {
  
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
    return {"id": "main", "contextId": "subjects"};
  };

  this.transition = function(oldState, newState, cb) {
    var panels = this.props.config.panels;
    var handled = false;
    // console.log('Writer.transition');
    // this.handleWriterTransition
    for (var i = 0; i < panels.length && !handled; i++) {
      var panelClass = panels[i];

      handled = panelClass.handleWriterTransition(this, oldState, newState, cb);
      if (handled) {
        console.log('HANDLED by', panelClass);
      }
    };

    // Let extensions handle state transitions
    cb(null);
  };

  this.render = function() {
    var contextPanel;

    // while initial transition is performed
    if (this.state.id === "uninitialized") {
      return $$('div', {text: "Loading contextual data..."});
    }

    // if (this.state.contextId === "toc") {
    //   contextPanel = $$('div', {text: "TOC_PANEL"});
    // } else if (this.state.contextId === "entities") {
    //   contextPanel = $$('div', {text: "ENTITIES_PANEL"});
    // } else if (this.state.contextId === "subjects") {
    //   contextPanel = $$('div', {text: "SUBJECTS PANEL"});
    //   // contextPanelClass = this.app.getFactory("panel").create(this.state.contextId); // FACTORY METHOD!
    // }

    // Construct contextPanel based on current writer state
    var contextPanel = this.props.config.createPanel(this);

    console.log('contextPanel', contextPanel);

    return $$("div", {className: "writer-component"},
      $$('div', {className: "contexts"},
        $$('a', {className: "toggle-context", href: "#", "data-id": "toc", text: "Contents"}),
        $$('a', {className: "toggle-context", href: "#", "data-id": "subjects", text: "Subjects"}),
        $$('a', {className: "toggle-context", href: "#", "data-id": "entities", text: "Entities"})
      ),
      $$(ContentPanel, {doc: this.props.doc, ref: "contentpanel"})
      // contextPanel
    );
  };
};

Writer.Prototype.prototype = Component.prototype;
Writer.prototype = new Writer.Prototype();

module.exports = Writer;