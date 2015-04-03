"use strict";

var Substance = require('substance');
var Document = Substance.Document;

// Writer Controller
// ----------------
//
// An common interface for all writer modules

var WriterController = function(opts) {
  this.config = opts.config;
  this.doc = opts.doc;
  this.writerComponent = opts.writerComponent;
  this.surfaces = {};
};

WriterController.Prototype = function() {

  // API method used by writer modules to modify the writer state
  this.replaceState = function(newState) {
    this.writerComponent.replaceState(newState);
  };

  this.registerSurface = function(surface, name) {
    name = name || Substance.uuid();
    this.surfaces[name] = surface;
    surface.connect(this, {
      'selection:changed': function(sel) {
        this.updateSurface(surface);
      }
    });
  };

  this.updateSurface = function(surface) {
    this.activeSurface = surface;
  };

  this.getSurface = function() {
    return this.activeSurface;
  };

  this.getSelection = function() {
    if (!this.activeSurface) return Document.nullSelection;
    return this.activeSurface.getSelection();
  };

  this.unregisterSurface = function(surface) {
    Substance.each(this.surfaces, function(s, name) {
      if (surface === s) {
        delete this.surfaces[name];
      }
    }, this);

    surface.disconnect(this);
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

  this.annotate = function(annoSpec) {
    var sel = this.getSelection();

    if (sel.isNull()) throw new Error("Selection is null");
    if (!sel.isPropertySelection()) throw new Error("Selection is not a PropertySelection");

    var annotation = Substance.extend({}, annoSpec);
    annotation.id = annoSpec.id || annoSpec.type+"_" + Substance.uuid();
    annotation.path = sel.getPath();
    annotation.range = sel.getTextRange();

    var tx = this.doc.startTransaction();
    annotation = tx.create(annotation);
    tx.save();

    // this.doc.data.create(annotation);
    // annotation = this.doc.get(annotation.id);

    console.log('created annotation', annotation);

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