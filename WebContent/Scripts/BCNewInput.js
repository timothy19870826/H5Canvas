/**
 * 
 */

export var BSJS_Input_MouseState = {};
BSJS_Input_MouseState.None = 0;
BSJS_Input_MouseState.Down = 1;
BSJS_Input_MouseState.Up = 2;
BSJS_Input_MouseState.Click = 3;
BSJS_Input_MouseState.Hold = 4;

export var BSJS_Input_KeyState = {};
BSJS_Input_KeyState.None = 0;
BSJS_Input_KeyState.Down = 1;
BSJS_Input_KeyState.Up = 2;
BSJS_Input_KeyState.Click = 3;
BSJS_Input_KeyState.Hold = 4;
 
export function BCJSInput() {
	this.mouseState = BSJS_Input_MouseState.None;
	this.keyState = BSJS_Input_KeyState.None;
	this.keyCode = null;
	this.onUpdate = function() {
		this.mouseState = BSJS_Input_MouseState.None;
		this.keyState = BSJS_Input_KeyState.None;
		this.keyCode = null;
	};
	this.onMouseDown = function() {
		this.mouseState = BSJS_Input_MouseState.Down;
	};
	this.onMouseUp = function() {
		this.mouseState = BSJS_Input_MouseState.Up;				
	};
	this.onMouseMove = function() {
		
	};
	this.onKeyDown = function() {
		this.mouseState = BSJS_Input_KeyState.Down;
	};
	this.onKeyUp = function() {
		this.mouseState = BSJS_Input_KeyState.Up;					
	};
}

export {BCJSInput};