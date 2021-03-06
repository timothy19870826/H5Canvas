/**
 * 
 */

define(["bcnew/bcnewEntity"], function(bcnewEntity) {

	
	function Sprite(image, x, y, width, height){
		this.image = image;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.ref = 0;
	}
	
	Sprite.prototype.autoSize = function() {
		if (this.width == null || this.height == null || this.width == 0 || this.height == 0) {
			if (this.image.assetReady){
				this.width = this.image.width;
				this.height = this.image.height;
			}
		}
	}
	
	Sprite.prototype.isReady = function() {
		return this.image != null && this.image.assetReady;
	}
	
	Sprite.prototype.getImage = function() {
		return this.image;
	}
	
	function Renderer(id){
		bcnewEntity.Component.call(this, "Renderer");
		this.typeName = "Renderer";
		this.active = true;
		this.dead = false;
		this.id = id;
		this.sprite = null;
	}
	
	Renderer.prototype = new bcnewEntity.Component();
	
	Renderer.prototype.init = function() {
		if (bcnRenderService != null){
			bcnRenderService.addRenderer(this);
		}
	}
	
	Renderer.prototype.destroy = function() {
		this.setSprite(null);
		if (bcnRenderService != null){
			bcnRenderService.removeRenderer(this);
		}
	}
	
	Renderer.prototype.getId = function() {
		return this.id;
	}
	
	Renderer.prototype.setSprite = function(sprite) {
		if (this.sprite != null){
			this.sprite.ref--;
			if (this.sprite.ref == 0){
				bcnAssetMng.unloadAsset(this.sprite.image.assetId);
			}
		}
		this.sprite = sprite;
		if (this.sprite != null){
			this.sprite.ref++;
		}
	}
	
	Renderer.prototype.getSprite = function(){
		return this.sprite;
	}
	
	Renderer.prototype.render = function(context) {
		// renderer
		if (this.sprite != null && this.sprite.isReady){
			this.sprite.autoSize();
			var rect = this.gameobject.transform.getRect();
			context.drawImage(this.sprite.getImage(), 
					this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height,
					rect.x, rect.y, rect.width, rect.height);
		}
		if (this.gameobject.collider != null){
			var bound = this.gameobject.collider.getCurBound();
			context.strokeRect(
					bound.x, 
					bound.y, 
					bound.width, 
					bound.height);
		}
	}
		
	bcnewEntity.regComponent("Renderer", function (){
		return new bcnewRender.Renderer();
	})
	
	function RenderService() {
		bcnewEntity.Entity.call(this, "RenderService");
		this.typeName = "RenderService";		
		this.rendererArr = new Array();		
		this.canvas = null;
		this.design = null;
		
		if (window.bcnRenderMng != null){
			throw "RenderService registed";
		}
		else{
			window.bcnRenderService = this;
		}
	}
	
	RenderService.prototype = new bcnewEntity.Entity();
	
	RenderService.prototype.bindCanvas = function(canvas, design) {
		this.canvas = canvas;
		this.design = design;
		if (this.canvas == null){
			throw "invalid canvas";
		}
	}
	
	RenderService.prototype.addRenderer = function(renderer) {
		if (this.rendererArr.indexOf(renderer) == -1){
			this.rendererArr.push(renderer);
		}
	}
	
	RenderService.prototype.removeRenderer = function(renderer) {
		var index = this.rendererArr.indexOf(renderer);
		if (index != -1){
			this.rendererArr.splice(index, 1);
		}
	}
	
	RenderService.prototype.onLateUpdate = function() {
		// sort
		this.rendererArr.sort(function(l, r) {
			if (l.gameobject.transform.getDepth() == r.gameobject.transform.getDepth()){
				return l.gameobject.transform.getPosition().y - r.gameobject.transform.getPosition().y
			}
			else{
				return l.gameobject.transform.getDepth() - r.gameobject.transform.getDepth();
			}
		})
		// render
		if (this.canvas == null){
			return;
		}
		var context = this.design.getContext("2d");
		context.fillStyle="#ffffff";        
		context.fillRect(0,0,this.design.width,this.design.height);
		for (var idx = 0; idx < this.rendererArr.length; ++idx){
			if (this.rendererArr[idx] == null){
				continue;
			}
			else if (this.rendererArr[idx].active && this.rendererArr[idx].dead == false){
				this.rendererArr[idx].render(context);
			}
		}
		
		context = this.canvas.getContext("2d");
		context.strokeRect(
				this.canvas.renderArea.x, 
				this.canvas.renderArea.y, 
				this.canvas.renderArea.width, 
				this.canvas.renderArea.height);
		context.drawImage(this.design, 
				0, 0, this.design.width, this.design.height,
				this.canvas.renderArea.x, this.canvas.renderArea.y, this.canvas.renderArea.width, this.canvas.renderArea.height);
	}
	
	return {
		RenderService : RenderService,
		Renderer : Renderer,
		Sprite : Sprite
	}
});