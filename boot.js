"use strict";
  
window.devMode = true;
var app = require("./src/app");

$(function() {

  // Create a new Lens app instance
  // --------
  //
  // Injects itself into body

  // var app = new window.SubstanceComposer({});
  // window.app = app;
  // var app = window.app;

  // launch it
  app.start();
});