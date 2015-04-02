"use strict";

var Substance = require('substance');

// Writer Controller
// ----------------
// 
// An common interface for all writer modules

var WriterController = function(opts) {
  this.config = opts.config;
  this.doc = opts.doc;
  this.writerComponent = opts.writerComponent;

};

WriterController.Prototype = function() {

  // API method used by writer modules to modify the writer state
  this.replaceState = function(newState) {
    this.writerComponent.replaceState(newState);
  };

  // Remove since we have a property getter already?
  this.getState = function() {
    return this.writerComponent.state;
  };
  
  this.getModules = function() {
    return this.config.modules;
  };

  this.getNodeComponentClass = function(nodeType) {
    var modules = this.config.modules;
    var NodeClass;

    for (var i = 0; i < modules.length; i++) {
      var ext = modules[i];
      if (ext.components && ext.components[nodeType]) {
        NodeClass = ext.components[nodeType];
      }
    }

    if (!NodeClass) throw new Error("No component found for "+nodeType);
    return NodeClass;
  };

  this.getPanels = function() {
    var modules = this.config.modules;
    var panels = [];

    for (var i = 0; i < modules.length; i++) {
      var ext = modules[i];
      panels = panels.concat(ext.panels);
    }
    return panels;
  };

  // Get all available tools from modules
  this.getTools = function() {
    var modules = this.config.modules;
    var tools = [];

    for (var i = 0; i < modules.length; i++) {
      var ext = modules[i];
      if (ext.tools) {
        tools = tools.concat(ext.tools);
      }
    }
    return tools;
  };

  // Based on a certain writer state, determine what should be
  // highlighted in the scrollbar. Maybe we need to create custom
  // handlers for highlights in modules, since there's no
  // general way of determining the highlights

  this.getHighlightedNodes = function() {
    var modules = this.getModules();
    var highlightedNodes = null;
    for (var i = 0; i < modules.length && !highlightedNodes; i++) {
      var stateHandlers = modules[i].stateHandlers;
      if (stateHandlers) {
        highlightedNodes = stateHandlers.getHighlightedNodes(this);
      }
    }
    return highlightedNodes || [];
  };

  // Get current active selection in writer
  this.getSelection = function() {
    // TODO: implement  
  };

  this.annotate = function(annoSpec) {
    // Some dumb fake implementation
    var path = ["text_3", "content"];
    var range = [40, 80];

    var annotation = {
      id: annoSpec.id || annoSpec.type+"_" + Substance.uuid(),
      type: annoSpec.type,
      path: path,
      range: range,
      target: annoSpec.target
    };

    // // Display reference in editor
    this.doc.create(annotation);

    var className = annotation.type.replace("_", "-");

    // // Some fake action until editor is ready
    var textNode = this.doc.get("text_3");
    var newContent = textNode.content += ' and <span data-id="'+annotation.id+'" class="annotation '+className+'">'+annotation.id+'</span>';
    this.doc.set(["text_3", "content"], newContent);

    return annotation;
  };

};

Substance.initClass(WriterController);

Object.defineProperty(WriterController.prototype, 'state', {
  get: function() {
    return this.writerComponent.state;
  },
  set: function(value) {
    throw new Error("Immutable property. Use replaceState");
  }
});


module.exports = WriterController;