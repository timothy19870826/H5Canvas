/**
 * 
 */

import BCJSInput from "./BCNewInput"

function BCJSCore() {
	this.canvas = null;
	this.input = null;
	this.initCanvas = function(width, height) {
		this.canvas = document.getElementById("main");
		if (this.canvas == null){
			console.log("Can't find main canvas");
			return false;
		}
		this.canvas.style.border = "thin";
		this.canvas.style.borderColor = "#000000";
		this.canvas.style.borderStyle = "solid";
		this.canvas.width = width;
		this.canvas.height = height;
		this.input = new BCJSInput();
		if (this.input == null){
			console.log("Initial input module failed");
			return false;
		}
		this.canvas.onmousedown = this.input.onMouseDown;
		return true;
	}
}