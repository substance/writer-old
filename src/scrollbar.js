"use strict";

var Application = require("substance-application");
var Component = Application.Component;
var $$ = Application.$$;
var _ = require("underscore");

// A rich scrollbar implementation that supports highlights
// ----------------

var Scrollbar = function(props) {
  Component.call(this, props);

  var self = this;

  _.bindAll(this, 'mouseDown', 'mouseUp', 'mouseMove', 'update');

	// HACK: Wait until next pass of main event loop to ensure self.props.panel.el is actually there
  // we wouldn't have this problem if we work with persistent .el elements
  // 
  // TODO: this needs to be triggered smarter right after panel has been mounted!
  // maybe we can use event interface for panels so that we can bind to
  // this.props.panel.on('componentDidMount', function() {
  //  // do things
  // })
  
  // Initialization
	_.delay(function() {
		self.panelContentEl = $(self.props.panel.el).find('.panel-content')[0];

    // Trigger update each time a scroll happens
		$(self.panelContentEl).on('scroll', _.bind(self.update, self));
		self.update();
	}, 0);
};

Scrollbar.Prototype = function() {

  this.events = {
    'mousedown': 'mouseDown'
  };

	this.componentDidMount = function() {
    // $(this.el).mousedown(this.mouseDown);
    // globals!
    $(window).mousemove(this.mouseMove);
    $(window).mouseup(this.mouseUp);
	};


  this.mouseDown = function(e) {
    this._mouseDown = true;
    var scrollBarOffset = $(this.el).offset().top;
    var y = e.pageY - scrollBarOffset;
    var thumbEl = this.refs.thumb;

    if (e.target !== thumbEl) {
      // Jump to mousedown position
      this.offset = $(thumbEl).height()/2;
      this.mouseMove(e);
    } else {
      this.offset = y - $(thumbEl).position().top;
    }
    return false;
  };

  // Handle Mouse Up
  // -----------------
  //
  // Mouse lifted, no scroll anymore

  this.mouseUp = function() {
    this._mouseDown = false;
  };

  // Handle Scroll
  // -----------------
  //
  // Handle scroll event
  // .visible-area handle

  this.mouseMove = function(e) {
    if (this._mouseDown) {
      var scrollBarOffset = $(this.el).offset().top;
      var y = e.pageY - scrollBarOffset;

      // find offset to visible-area.top
      var scroll = (y-this.offset)*this.factor;
      this.scrollTop = $(this.panelContentEl).scrollTop(scroll);
    }
  };

  this.componentDidRender = function() {
    console.log('Scrollbar did render');
  };

  // Update scrollbar
  // -----------------
  //
	// From the current rendering of .panel .panel-content derive state object
	// that is used for rendering the scrollbar

	this.update = function() {
		var self = this;

    // initialized lazily as this element is not accessible earlier (e.g. during construction)
    // get the new dimensions
    // TODO: use outerheight for contentheight determination?
    var contentHeight = $(self.panelContentEl).find('> div').outerHeight();
    var panelHeight = $(self.panelContentEl).height();

    // Needed for scrollbar interaction
    this.factor = (contentHeight / panelHeight);
    
    var scrollTop = $(self.panelContentEl).scrollTop();

    // Compute highlights
    var highlights = this.props.highlights.map(function(nodeId) {
      var nodeEl = $(self.panelContentEl).find('*[data-id='+nodeId+']');
      var top = nodeEl.position().top / self.factor;
      var height = nodeEl.outerHeight(true) / self.factor;

      // HACK: make all highlights at least 3 pxls high, and centered around the desired top pos
      if (height < Scrollbar.overlayMinHeight) {
        height = Scrollbar.overlayMinHeight;
        top = top - 0.5 * Scrollbar.overlayMinHeight;
      }

      var data = {
        id: nodeId,
        top: top,
        height: height
      }
      return data;
    });

    var thumbProps = {
    	top: scrollTop / this.factor,
    	height: panelHeight / this.factor
    };

		this.setState({
			thumb: thumbProps,
			highlights: highlights
		});
	};

	// We need to wait until component gets injected into the dom (see update)
	this.getInitialState = function() {
		return {
			thumb: {top: 0, height: 20}, // just render at the top
			highlights: [] // no highlights until state derived
		};
	};

  this.render = function() {
  	var highlightEls = this.state.highlights.map(function(h) {
  		return $$('div', {
        className: 'highlight',
        style: "top:"+ h.top +"px; height: "+h.height+"px;"  
      });
  	});

  	var thumbEl = $$('div', {
      ref: "thumb",
  		className: "thumb",
  		style: "top:"+ this.state.thumb.top +"px; height: "+this.state.thumb.height+"px;"
  	});

    return $$("div", {className: "scrollbar-component"},
      thumbEl,
      $$('div', {className: 'highlights'}, 
      	highlightEls
      )
    );
  };
};

Scrollbar.persistent = true;
Scrollbar.overlayMinHeight = 5;

Scrollbar.Prototype.prototype = Component.prototype;
Scrollbar.prototype = new Scrollbar.Prototype();

module.exports = Scrollbar;
