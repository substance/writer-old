var Application = require("substance-application");
var Component = Application.Component;
var $$ = Application.$$;
var _ = require("underscore");

// Abstract Panel Component
// ----------------

var Panel = function(props) {
  Component.call(this, props);
};

Panel.Prototype = function() {
  // This is the default rendering of a panel
  // Custom panels must have the exact same structure
  this.render = function() {
    return $$("div", {className: "panel"}, // usually absolutely positioned
      $$('div', {className: "panel-content"}) // has overflow: auto, so this is the scrolling container
    )
  };
};

// Should a panel be persistent by default?
// Panel.persistent = true;

Panel.Prototype.prototype = Component.prototype;
Panel.prototype = new Panel.Prototype();

module.exports = Panel;