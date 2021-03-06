/**
 * @fileoverview The base Game class
 * 
 * @author Tony Parisi
 */
goog.provide('SB.Game');
goog.require('SB.PubSub');
goog.require('SB.Time');
goog.require('SB.Input');
goog.require('SB.Services');

/**
 * @constructor
 */
SB.Game = function()
{
	// N.B.: freak out if somebody tries to make 2
	// throw (...)

	SB.PubSub.call(this);
	SB.Game.instance = this;
}

goog.inherits(SB.Game, SB.PubSub);

SB.Game.prototype.initialize = function(param)
{
	param = param || {};

	this.tabstop = param.tabstop;
	
	this._services = [];
	this._entities = [];

	// Add required services first
	this.addService("time");
	this.addService("input");
	
	// Add optional (game-defined) services next
	this.addOptionalServices();

	// Add events and rendering services last - got to;
	this.addService("events");
	this.addService("graphics");
	
	// Start all the services
	this.initServices(param);
}

SB.Game.prototype.addService = function(serviceName)
{
	var service = SB.Services.create(serviceName);
	this._services.push(service);	
}

SB.Game.prototype.initServices = function(param)
{
	var i, len;
	len = this._services.length;
	for (i = 0; i < len; i++)
	{
		this._services[i].initialize(param);
	}
}

SB.Game.prototype.addOptionalServices = function()
{
}

SB.Game.prototype.focus = function()
{
	// Hack hack hack should be the input system
	SB.Graphics.instance.focus();
}

SB.Game.prototype.run = function()
{
    // core game loop here	        	
	// this.graphics.run();
	this.lastFrameTime = Date.now();
	this.runloop();
}
	        
SB.Game.prototype.runloop = function()
{
	var now = Date.now();
	var deltat = now - this.lastFrameTime;
	
	if (deltat >= SB.Game.minFrameTime)
	{
		this.handleMessages();
		this.updateServices();
        this.lastFrameTime = now;
	}
	
	var that = this;
    requestAnimationFrame( function() { that.runloop(); } );
}

SB.Game.prototype.updateServices = function()
{
	var i, len;
	len = this._services.length;
	for (i = 0; i < len; i++)
	{
		this._services[i].update();
	}
}

SB.Game.prototype.updateEntities = function()
{
	var i, len = this._entities.length;
	
	for (i = 0; i < len; i++)
	{
		this._entities[i].update();
	}
	
}

SB.Game.prototype.addEntity = function(e)
{
	this._entities.push(e);
}

SB.Game.prototype.removeEntity = function(e) {
    var i = this._entities.indexOf(e);
    if (i != -1) {
    	// N.B.: I suppose we could be paranoid and check to see if I actually own this component
        this._entities.splice(i, 1);
    }
}
	
SB.Game.prototype.onMouseMove = function(x, y)
{
	if (this.mouseDelegate)
	{
		this.mouseDelegate.onMouseMove(x, y);
	}
}

SB.Game.prototype.onMouseDown = function(x, y)
{
	if (this.mouseDelegate)
	{
		this.mouseDelegate.onMouseDown(x, y);
	}
}

SB.Game.prototype.onMouseUp = function(x, y)
{
	if (this.mouseDelegate)
	{
		this.mouseDelegate.onMouseUp(x, y);
	}
}

SB.Game.prototype.onMouseScroll = function(delta)
{
	if (this.mouseDelegate)
	{
		this.mouseDelegate.onMouseScroll(delta);
	}
}

SB.Game.prototype.onKeyDown = function(keyCode, charCode)
{
	if (this.keyboardDelegate)
	{
		this.keyboardDelegate.onKeyDown(keyCode, charCode);
	}
}

SB.Game.prototype.onKeyUp = function(keyCode, charCode)
{
	if (this.keyboardDelegate)
	{
		this.keyboardDelegate.onKeyUp(keyCode, charCode);
	}
}

SB.Game.prototype.onKeyPress = function(keyCode, charCode)
{
	if (this.keyboardDelegate)
	{
		this.keyboardDelegate.onKeyPress(keyCode, charCode);
	}
}	

/* statics */

SB.Game.instance = null;
SB.Game.curEntityID = 0;
SB.Game.minFrameTime = 1;
	    	
SB.Game.handleMouseMove = function(pageX, pageY, eltX, eltY)
{
    if (SB.Picker.clickedObject)
    	return;
    
    if (SB.Game.instance.onMouseMove)
    	SB.Game.instance.onMouseMove(pageX, pageY, eltX, eltY);	            	
}

SB.Game.handleMouseDown = function(pageX, pageY, eltX, eltY)
{
    // N.B.: ahh, the bullshit continues...
    if (SB.Game.instance.tabstop)
    	SB.Game.instance.focus();
    
    // console.log("Mouse down " + event.pageX + ", " + event.pageY);
    
    if (SB.Picker.clickedObject)
    	return;
    
    if (SB.Game.instance.onMouseDown)
    	SB.Game.instance.onMouseDown(pageX, pageY, eltX, eltY);	            	
}

SB.Game.handleMouseUp = function(pageX, pageY, eltX, eltY)
{
    if (SB.Picker.clickedObject)
    	return;
    
    if (SB.Game.instance.onMouseUp)
    	SB.Game.instance.onMouseUp(pageX, pageY, eltX, eltY);	            	
}

SB.Game.handleMouseScroll = function(delta)
{
    if (SB.Picker.overObject)
    	return;
    
    if (SB.Game.instance.onMouseScroll)
    	SB.Game.instance.onMouseScroll(delta);	            	
}

SB.Game.handleKeyDown = function(keyCode, charCode)
{
    if (SB.Game.instance.onKeyDown)
    	SB.Game.instance.onKeyDown(keyCode, charCode);	            	
}

SB.Game.handleKeyUp = function(keyCode, charCode)
{
    if (SB.Game.instance.onKeyUp)
    	SB.Game.instance.onKeyUp(keyCode, charCode);	            	
}

SB.Game.handleKeyPress = function(keyCode, charCode)
{
    if (SB.Game.instance.onKeyPress)
    	SB.Game.instance.onKeyPress(keyCode, charCode);	            	
}	        
