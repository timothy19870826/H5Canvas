/**
 * 
 */

define(["bcnew/bcnewEntity"], function (bcnewEntity){
	
	var BSJS_Input_Delay = {};
	BSJS_Input_Delay.keyDelay = 1;
	BSJS_Input_Delay.mouseDelay = 1;

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
	
	function Input(){
		bcnewEntity.Entity.call(this, "InputService");
		this.typeName = "InputService";
		this.canvas = null;
		if (window.bcnInput == null){
			window.bcnInput = this;
		}
		else {
			throw "InputService registed";
		}
			
	}
	Input.prototype = new bcnewEntity.Entity();	
	
	Input.prototype.bindCanvas = function(canvas) {
		this.canvas = canvas;
		this.canvas.keyCode = 0;
		this.canvas.keyState = BSJS_Input_KeyState.Release;
		this.canvas.mouseState = BSJS_Input_MouseState.Release;
		this.canvas.mousePos = new bcnewEntity.Vector2(0, 0);

		this.canvas.onmousedown = onMouseDown;
		this.canvas.onmouseup = onMouseUp;
		this.canvas.onmousemove = onMouseMove;
		this.canvas.onkeydown = onKeyDown;
		this.canvas.onkeyup = onKeyUp;
		
		this.mouseDelay = 0;
		this.keyDelay = 0;
	}
	
	Input.prototype.isKeyDown = function(key){
		return this.canvas.keyState == BSJS_Input_KeyState.Down && this.canvas.keyCode == key;
	};
	
	Input.prototype.isKeyUp = function(key){
		return this.canvas.keyState == BSJS_Input_KeyState.Up && this.canvas.keyCode == key;
	};
	
	Input.prototype.isKeyHold = function(key){
		return this.canvas.keyState == BSJS_Input_KeyState.Hold && this.canvas.keyCode == key;
	};
	
	Input.prototype.isMouseDown = function(){
		return this.canvas.mouseState == BSJS_Input_MouseState.Down;
	};
	
	Input.prototype.isMouseUp = function(){
		return this.canvas.mouseState == BSJS_Input_MouseState.Up;
	};
	
	Input.prototype.isMouseHold = function(){
		return this.canvas.mouseState == BSJS_Input_MouseState.Hold;
	}
	
	Input.prototype.resetState = function() {
		if (this.canvas.mouseState == BSJS_Input_MouseState.Down){
			this.canvas.mouseState = BSJS_Input_MouseState.Hold;
		}
		else if (this.canvas.mouseState == BSJS_Input_MouseState.Up){
			if (this.mouseDelay == 0){
				this.mouseDelay = BSJS_Input_Delay.mouseDelay;
				this.canvas.mouseState = BSJS_Input_MouseState.Release;
			}
			this.mouseDelay--;
		}

		if (this.canvas.keyState == BSJS_Input_KeyState.Down){
			this.canvas.keyState = BSJS_Input_KeyState.Hold;
		}
		else if (this.canvas.keyState == BSJS_Input_KeyState.Up){
			if (this.keyDelay == 0){
				this.keyDelay = BSJS_Input_Delay.keyDelay;
				this.canvas.keyState = BSJS_Input_KeyState.Release;
			}
			this.keyDelay--;
		}
	};
	
	Input.prototype.onDestroy = function() {
		console.log("input servce destory");
	};
	
	onMouseDown = function(event) {		
		this.mousePos.x = event.clientX;
		this.mousePos.y = event.clientY;
		this.mouseState = BSJS_Input_MouseState.Down;
	};
	
	onMouseUp = function(event) {
		this.mousePos.x = event.clientX;
		this.mousePos.y = event.clientY;
		this.mouseState = BSJS_Input_MouseState.Up;		
		console.log("x:" + this.mousePos.x + ",y:" + this.mousePos.y);		
	};
	
	onMouseMove = function(event) {
		this.mousePos.x = event.clientX;
		this.mousePos.y = event.clientY;
	};
	
	onKeyDown = function(event) {
		this.keyCode = event.key;
		this.mouseState = BSJS_Input_KeyState.Down;
	};
	
	onKeyUp = function(event) {
		this.keyCode = event.key;
		this.mouseState = BSJS_Input_KeyState.Up;					
	};
	
	return {
		BSJS_Input_MouseState : BSJS_Input_MouseState,
		BSJS_Input_KeyState : BSJS_Input_KeyState,
		
		Input : Input,
	}
});

