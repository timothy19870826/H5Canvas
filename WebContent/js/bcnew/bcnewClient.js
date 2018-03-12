/**
 * 
 */

define(
		["bcnew/bcnewEntity", 
		"bcnew/bcnewCollider", 
		"bcnew/bcnewGameObject", 
		"bcnew/bcnewResource", 
		"bcnew/bcnewRender", 
		"bcnew/bcnewInput"], 
function (bcnewEntity, bcnewCollider, bcnewGameObject, bcnewResource, bcnewRender, bcnewInput){
	
	function Timer(){
		var date = new Date();
		this.curTime = date.getTime();
	}
	
	Timer.prototype.update = function() {
		var date = new Date();
		this.frameTime = date.getTime() - this.curTime;
		this.curTime = date.getTime();
	}
	
	Timer.prototype.getCurTime = function() {
		return this.curTime;
	}
	
	Timer.prototype.getFrameTime = function() {
		return this.frameTime;
	}
			
	function Client(){
		this.canvas = null;
		this.mainLoopId = null;
		this.scale = 1;
		window.bcnTimer = new Timer();
		window.bcnServiceCenter = new bcnewEntity.ServiceCenter();
		bcnServiceCenter.regService(new bcnewInput.Input());
		bcnServiceCenter.regService(new bcnewRender.RenderService());
		bcnServiceCenter.regService(new bcnewGameObject.GameObjectMng());
		bcnServiceCenter.regService(new bcnewResource.ResourceMng());
		bcnServiceCenter.regService(new bcnewCollider.ColliderMng());
	}
	
	Client.prototype.initCanvas = function (width, height){
		
		this.cache = document.createElement("canvas");
		this.cache.style.display = "none";
		this.cache.style.left = "0px";
		this.cache.style.top = "0px";
		this.cache.width = width;
		this.cache.height = height;
		document.body.appendChild(this.cache);
		
		this.canvas = document.createElement("canvas");
		document.body.appendChild(this.canvas);

		this.canvas.style.border = "thin";
		this.canvas.style.borderColor = "#000000";
		this.canvas.style.borderStyle = "solid";
		this.canvas.style.position = "absolute";
		
		var clientW = window.innerWidth;
		var clientH = window.innerHeight;
		console.log("width:" + clientW + ",height:" + clientH);
		if (clientH > clientW && height > width){
			this.scale = clientH / height;
		}
		else if (window.innerHeight > clientW && height < width){
			this.scale = clientW / width;
		}
		else if (clientH < clientW && height > width){
			this.scale = clientH / height;
		}
		
		var renderArea = new bcnewEntity.Rect(0, 0, width * this.scale, height * this.scale);
		console.log(renderArea);
		if (renderArea.width < clientW){
			var offset = (clientW - renderArea.width);
			if (offset > 2){
				renderArea.x = offset / 2;
				console.log("0:" + offset);
				console.log(renderArea);
				console.log("width:" + clientW + ",height:" + clientH);
			}
			this.canvas.width = clientW;
		}
		else{
			this.canvas.width = renderArea.width;
		}
		if (renderArea.height < clientH){
			var offset = (clientH - renderArea.height);
			if (offset > 2){
				renderArea.y = offset / 2;
				console.log("2:" + offset);
				console.log(renderArea);
				console.log("width:" + clientW + ",height:" + clientH);
			}
			this.canvas.height = clientH;
		}
		else{
			this.canvas.height = renderArea.height;
		}
		this.canvas.style.left = "0px";
		this.canvas.style.top = "0px";
		this.canvas.renderArea = renderArea;
		bcnInput.bindCanvas(this.canvas);
		bcnRenderService.bindCanvas(this.canvas, this.cache);
		console.log(renderArea);
		return true;
	}	
	
	Client.prototype.update = function (){
		bcnTimer.update();
		bcnServiceCenter.update();
		bcnServiceCenter.lateUpdate();
		bcnInput.resetState();
	}
	
	function init(width, height){
		window.bcnClient = new Client();
		bcnClient.initCanvas(width, height);
	}
	
	function startMainLoop(){
		bcnClient.mainLoopId = setInterval(function() {
			bcnClient.update();
		}, 40);
	}
	
	function stopMainLoop(){
		clearInterval(bcnClient.mainLoopId);
	}
	
	function inputPos2Game(pos){
		return new bcnewEntity.Vector2(pos.x / bcnClient.scale, pos.y / bcnClient.scale);
	}	
	
	return {
		init : init,
		startMainLoop : startMainLoop,
		stopMainLoop : stopMainLoop,
		inputPos2Game : inputPos2Game
	}
});