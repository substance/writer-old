var CoreModule = require("substance/writer").CoreModule;

var BaseModule = require("./base");
var RemarksModule = require("./remarks");

module.exports = [
  RemarksModule,
  CoreModule,
  BaseModule
];
