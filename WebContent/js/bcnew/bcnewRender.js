/**
 * 
 */

define(["bcnew/bcnewEntity", "bcnew/bcnewResource"], function(bcnewEntity, bcnewResource) {

	
	function Sprite(asset, x, y, width, height){
		this.asset = asset;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	
	Sprite.prototype.autoSize = function() {
		if (this.width == null || this.height == null || this.width == 0 || this.height == 0) {
			console.log(this.asset);
			if (this.asset.isReady()){
				this.width = this.asset.image.width;
				this.height = this.asset.image.height;
			}
		}
	}
	
	Sprite.prototype.isReady = function() {
		return this.asset != null && this.asset.ready;
	}
	
	Sprite.prototype.getImage = function() {
		return this.asset.image;
	}
	
	function Renderer(id){
		bcnewEntity.Component.call(this, "Renderer");
		this.typeName = "Renderer";
		this.active = true;
		this.dead = false;
		this.x = 0;
		this.y = 0;
		this.width = 10;
		this.height = 10;
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
		if (bcnRenderService != null){
			bcnRenderService.removeRenderer(this);
		}
	}
	
	Renderer.prototype.getId = function() {
		return this.id;
	}
	
	Renderer.prototype.setSprite = function(sprite) {
		this.sprite = sprite;
	}
	
	Renderer.prototype.getSprite = function(){
		return this.sprite;
	}
	
	Renderer.prototype.setPosX = function(x){
		this.x = x;
	}
	
	Renderer.prototype.getPosX = function() {
		return this.x;
	}
	
	Renderer.prototype.setPosY = function(y) {
		this.y = y;
	}
	
	Renderer.prototype.getPosY = function() {
		return this.y;
	}
	
	Renderer.prototype.setPos = function(x, y) {
		this.x = x;
		this.y = y;
	}
	
	Renderer.prototype.setWidth = function(width) {
		this.width = width;
	}
	
	Renderer.prototype.getWidth = function() {
		return this.width;
	}
	
	Renderer.prototype.setHeight = function(height) {
		this.height = height;
	}
	
	Renderer.prototype.getHeight = function() {
		return this.height;
	}
	
	Renderer.prototype.setSize = function(width, height) {
		this.width = width;
		this.height = height;
	}
	
	Renderer.prototype.render = function(context) {
		// renderer
		if (this.sprite != null && this.sprite.isReady){
			this.sprite.autoSize();
			var position = this.gameobject.transform.getPosition();
			var scale = this.gameobject.transform.getLossyScale();
			context.drawImage(this.sprite.getImage(), 
					this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height,
					position.x, position.y, this.width * scale.x, this.height * scale.y);
		}
	}
	
	function RenderService() {
		bcnewEntity.Entity.call(this, "RenderService");
		this.typeName = "RenderService";		
		this.rendererArr = new Array();		
		this.canvas = null;
		
		if (window.bcnRenderMng != null){
			throw "RenderService registed";
		}
		else{
			window.bcnRenderService = this;
		}
	}
	
	RenderService.prototype = new bcnewEntity.Entity();
	
	RenderService.prototype.bindCanvas = function(canvas) {
		this.canvas = canvas;
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
			return l.gameobject.transform.getPosition().y - r.gameobject.transform.getPosition().y
		})
		// render
		if (this.canvas == null){
			return;
		}
		var context = this.canvas.getContext("2d");
		context.fillStyle="#ffffff";        
		context.fillRect(0,0,this.canvas.width,this.canvas.height);
		for (var idx = 0; idx < this.rendererArr.length; ++idx){
			if (this.rendererArr[idx] == null){
				continue;
			}
			else if (this.rendererArr[idx].active && this.rendererArr[idx].dead == false){
				this.rendererArr[idx].render(context);
			}
		}
	}
	
	return {
		RenderService : RenderService,
		Renderer : Renderer,
		Sprite : Sprite
	}
});