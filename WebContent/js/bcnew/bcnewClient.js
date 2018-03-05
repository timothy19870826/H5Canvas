/**
 * 
 */

define(["bcnewEntity", "bcnewRender", "bcnewInput"], function (bcnewEntity, bcnewRender, bcnewInput){
	
	function Client(){
		this.canvas = null;
		this.mainLoopId = null;
		window.bcnServiceCenter = new bcnewEntity.ServiceCenter();
		window.bcnGameObjectMng = new bcnewEntity.GameObject("root");
	}
	
	Client.prototype.initCanvas = function (x, y, width, height){
		
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
		var bcnRenderService = new bcnewRender.RenderService(this.canvas);
		var bcnInput = new bcnewInput.Input(x, y);
		bcnServiceCenter.regService(bcnInput);
		bcnServiceCenter.regService(bcnRenderService);
		this.canvas.onmousedown = bcnInput.onMouseDown;
		return true;
	}	
	
	Client.prototype.update = function (){
		bcnServiceCenter.update();
		bcnGameObjectMng.update();
		bcnServiceCenter.lateUpdate();
		bcnGameObjectMng.lateUpdate();
	}
	
	function init(x, y, width, height){
		window.bcnClient = new Client();
		bcnClient.initCanvas(0,0,500,800);
	}
	
	function startMainLoop(){
		bcnClient.mainLoopId = setInterval(function() {
			bcnClient.update();
		}, 40);
	}
	
	function stopMainLoop(){
		clearInterval(bcnClient.mainLoopId);
	}
	
	return {
		init : init,
		startMainLoop : startMainLoop,
		stopMainLoop : stopMainLoop
	}
	
	
	return {
		Client : Client,
		init : init,
		startMainLoop : startMainLoop,
		stopMainLoop : stopMainLoop
	}
});