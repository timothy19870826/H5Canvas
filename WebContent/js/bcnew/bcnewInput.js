/**
 * 
 */

define(["bcnewEntity"], function (bcnewEntity){

	var BSJS_Input_MouseState = {};
	BSJS_Input_MouseState.Release = 0;
	BSJS_Input_MouseState.Down = 1;
	BSJS_Input_MouseState.Up = 2;
	BSJS_Input_MouseState.Click = 3;
	BSJS_Input_MouseState.Hold = 4;

	var BSJS_Input_KeyState = {};
	BSJS_Input_KeyState.Release = 0;
	BSJS_Input_KeyState.Down = 1;
	BSJS_Input_KeyState.Up = 2;
	BSJS_Input_KeyState.Click = 3;
	BSJS_Input_KeyState.Hold = 4;
	
	function Input(offsetX, offsetY){
		bcnewEntity.Entity.call(this, "InputService");

		this.typeName = "InputService";
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.mouseState = BSJS_Input_MouseState.Release;
		this.keyState = BSJS_Input_KeyState.Release;
		this.mousePos = {x:0,y:0};
		this.keyCode = null;
		if (window.bcnInput == null){
			window.bcnInput = this;
		}
		else {
			throw "InputService registed";
		}
			
	}
	Input.prototype = new bcnewEntity.Entity();	
	
	var toMousePos = function(event, x, y){
		finalX = event.clientX-x;
		finalY = event.clientY-y;
		return {x:event.clientX, y:event.clientY};
	};
	
	var toKeyCode = function(event){
		return event.key;
	};
	
	Input.prototype.isKeyDown = function(key){
		return this.keyState == BSJS_Input_KeyState.Down && this.keyCode == key;
	};
	
	Input.prototype.isKeyUp = function(key){
		return this.keyState == BSJS_Input_KeyState.Up && this.keyCode == key;
	};
	
	Input.prototype.isKeyHold = function(key){
		return this.keyState == BSJS_Input_KeyState.Hold && this.keyCode == key;
	};
	
	Input.prototype.isMouseDown = function(){
		return this.mouseState == BSJS_Input_MouseState.Down;
	};
	
	Input.prototype.isMouseUp = function(){
		return this.mouseState == BSJS_Input_MouseState.Up;
	};
	
	Input.prototype.isMouseHold = function(){
		return this.mouseState == BSJS_Input_MouseState.Hold;
	}
	
	Input.prototype.onUpdate = function() {
		var d = new Date()
		console.log(d.getTime());
		if (this.mouseState == BSJS_Input_MouseState.Down){
			this.mouseState = BSJS_Input_MouseState.Hold;
		}
		else if (this.mouseState == BSJS_Input_MouseState.Up){
			this.mouseState = BSJS_Input_MouseState.Release;
		}

		if (this.keyState == BSJS_Input_KeyState.Down){
			this.keyState = BSJS_Input_KeyState.Hold;
		}
		else if (this.keyState == BSJS_Input_KeyState.Up){
			this.keyState = BSJS_Input_KeyState.Release;
		}
	};
	
	Input.prototype.onMouseDown = function(event) {		
		this.mousePos = toMousePos(event, this.offsetX, this.offsetY);
		this.mouseState = BSJS_Input_MouseState.Down;
		console.log("x:" + this.mousePos.x + ",y:" + this.mousePos.y);
	};
	
	Input.prototype.onMouseUp = function(event) {
		this.mousePos = toMousePos(event, this.offsetX, this.offsetY);
		this.mouseState = BSJS_Input_MouseState.Up;				
	};
	
	Input.prototype.onMouseMove = function(event) {
		this.mousePos = toMousePos(event, this.offsetX, this.offsetY);
	};
	
	Input.prototype.onKeyDown = function(event) {
		this.keyCode = toKeyCode(event);
		this.mouseState = BSJS_Input_KeyState.Down;
	};
	
	Input.prototype.onKeyUp = function(event) {
		this.keyCode = toKeyCode(event);
		this.mouseState = BSJS_Input_KeyState.Up;					
	};
	
	Input.prototype.onDestroy = function() {
		console.log("input servce destory");
	};
	
	return {
		BSJS_Input_MouseState : BSJS_Input_MouseState,
		BSJS_Input_KeyState : BSJS_Input_KeyState,
		
		Input : Input,
	}
});

