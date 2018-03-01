/**
 * 
 */

define(["bcnewinput"], function (bcnewinput){
	
	function Core(){
		this.canvas = null;
		this.input = null;
		this.serviceArray = new Array();
		this.mainLoopId = null;
	}
	
	Core.prototype.initCanvas = function (x, y, width, height){
		this.canvas = document.getElementById("main");
		if (this.canvas == null){
			return false;
		}
		this.canvas.style.border = "thin";
		this.canvas.style.borderColor = "#000000";
		this.canvas.style.borderStyle = "solid";
		this.canvas.style.position = "absolute";
		this.canvas.style.left = "0px";
		this.canvas.style.top = "0px";
		this.canvas.width = width;
		this.canvas.height = height;
		this.input = new bcnewinput.Input(x, y);
		if (this.input == null){
			return false;
		}
		this.regService(this.input);
		this.canvas.onmousedown = this.input.onMouseDown;
		return true;
	}
	
	Core.prototype.findService = function (service){
		for (var idx = 0; idx < this.serviceArray.length; ++idx){
			if (this.serviceArray[idx] == service){
				return idx;
			}
		}
		return -1;
	}
	
	Core.prototype.findServiceByName = function (name){
		for (var idx = 0; idx < this.serviceArray.length; ++idx){
			if (this.serviceArray[idx].getName() == name){
				return idx;
			}
		}
		return -1;
	}
	
	Core.prototype.regService = function (service){
		var idx = this.findService(service);
		if (idx == -1){
			service.init();
			alert("service:" + service.getName());
			this.serviceArray.push(service);
		}
		else {
			throw service.getName() + "has registed";
		}
	}
	
	Core.prototype.unregService = function (service){
		var idx = this.findService(service);
		if (idx >= 0){
			this.serviceArray.splice(idx, 1);
			service.destroy();
		}
	}
	
	Core.prototype.unregServiceByName = function (name){
		var idx = this.findServiceByName(name);
		if (idx >= 0){
			var service = this.serviceArray[idx];
			this.serviceArray.splice(idx, 1);
			service.destroy();
		}
	}
	
	Core.prototype.update = function (){
		for (var idx = 0; idx < this.serviceArray.length; ++idx){
			if (this.serviceArray[idx] != null){
				this.serviceArray[idx].update();
			}
		}
		for (var idx = 0; idx < this.serviceArray.length; ++idx){
			if (this.serviceArray[idx] != null){
				this.serviceArray[idx].lateUpdate();
			}
		}
	}
	
	function init(x, y, width, height){
		window.core = new Core();
		core.initCanvas(0,0,500,800);
	}
	
	function regService(service){
		core.regService(service);
	}
	
	function unregService(service){
		core.unregService(service);
	}
	
	function findService(name){
		return core.findServiceByName(name);
	}
	
	function startMainLoop(){
		core.mainLoopId = setInterval(function() {
			core.update();
		}, 40);
	}
	
	function stopMainLoop(){
		clearInterval(core.mainLoopId);
	}
	
	return {
		init : init,
		regService : regService,
		unregService : unregService,
		findService : findService,
		startMainLoop : startMainLoop,
		stopMainLoop : stopMainLoop
	}
});
