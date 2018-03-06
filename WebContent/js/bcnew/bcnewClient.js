/**
 * 
 */

define(["bcnew/bcnewEntity", "bcnew/bcnewGameObject", "bcnew/bcnewResource", "bcnew/bcnewRender", "bcnew/bcnewInput"], 
function (bcnewEntity, bcnewGameObject, bcnewResource, bcnewRender, bcnewInput){
	
	function Client(){
		this.canvas = null;
		this.mainLoopId = null;
		window.bcnServiceCenter = new bcnewEntity.ServiceCenter();
		bcnServiceCenter.regService(new bcnewInput.Input());
		bcnServiceCenter.regService(new bcnewRender.RenderService());
		bcnServiceCenter.regService(new bcnewGameObject.GameObjectMng());
		bcnServiceCenter.regService(new bcnewResource.ResourceMng());
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
		bcnInput.bindCanvas(this.canvas);
		bcnRenderService.bindCanvas(this.canvas);
		return true;
	}	
	
	Client.prototype.update = function (){
		bcnServiceCenter.update();
		bcnServiceCenter.lateUpdate();
		bcnInput.resetState();
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