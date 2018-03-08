/**
 * 
 */
define(["bcnew/bcnewEntity"], function(bcnewEntity) {
	
	function Transform(){
		bcnewEntity.Component.call(this, "Transform");
		/*
		//this.rotate = 0;
		//this.localRotate = 0;
		*/
		this.depth = 0;
		this.localDepth = 0;
		this.size = new bcnewEntity.Vector2(1, 1);
		this.position = new bcnewEntity.Vector2(0, 0);
		this.localPosition = new bcnewEntity.Vector2(0, 0);
		this.lossyScale = new bcnewEntity.Vector2(1, 1);
		this.localScale = new bcnewEntity.Vector2(1, 1);
		this.parent = null;
		this.child = new Array();
		this.rect = new bcnewEntity.Rect(0, 0, 1, 1);
	}
	
	Transform.prototype = new bcnewEntity.Component();
	
	/*
	Transform.prototype.setRotate = function(rotate) {
		this.rotate = rotate;
	}
	
	Transform.prototype.getRotate = function() {
		return this.rotate;
	}
	
	Transform.prototype.setLocalRotate = function(rotate) {
		this.localRotate = rotate;
	}
	
	Transform.prototype.getLocalRotate = function() {
		return this.localRotate;
	}
	*/
	
	Transform.prototype.getRect = function(){
		var position = this.gameobject.transform.getPosition();
		var scale = this.gameobject.transform.getLossyScale();
		var size = this.gameobject.transform.getSize();
		this.rect.x = position.x;
		this.rect.y = position.y;
		this.rect.width = size.x * scale.x;
		this.rect.height = size.y * scale.y;
		return this.rect;
	}

	Transform.prototype.setSize = function(size) {
		this.size = size;
	}
	
	Transform.prototype.getSize = function() {
		return this.size;
	}
	
	Transform.prototype.setDepth = function(depth) {
		this.depth = depth;
		this.localDepth = this.depth - this.parent.depth;
	}
	
	Transform.prototype.getDepth = function() {
		return this.depth;
	}
	
	Transform.prototype.setLocalDepth = function(depth) {
		this.localDepth = depth;
		this.depth = this.localDepth + this.parent.depth;
	}
	
	Transform.prototype.getLocalDepth = function() {
		return this.localDepth;
	}
	
	Transform.prototype.setPosition = function(position) {
		this.position.x = position.x;
		this.position.y = position.y;
		this.localPosition.x = position.x - this.parent.position.x;
		this.localPosition.y = position.y - this.parent.position.y;
	}
	
	Transform.prototype.getPosition = function() {
		return this.position;
	}
	
	Transform.prototype.setLocalPosition = function(position) {
		this.localPosition = position;
		this.position.x = position.x + this.parent.position.x;
		this.position.y = position.y + this.parent.position.y;
	}
	
	Transform.prototype.getLocalPosition = function() {
		return this.localPosition;
	}
	Transform.prototype.getLossyScale = function() {
		return this.lossyScale;
	}
	
	Transform.prototype.setLocalScale = function(scale) {
		this.localScale = scale;
		this.lossyScale.x = scale.x * this.parent.lossyScale.x;
		this.lossyScale.y = scale.y * this.parent.lossyScale.y;
	}
	
	Transform.prototype.getLocalScale = function() {
		return this.localScale;
	}
	
	Transform.prototype.setParent = function(parent) {
		if (this.parent == parent){
			return;
		}
		if (parent == null && this.parent == bcnGameObjectMng.transform){
			return;
		}
		if (this.parent != null){
			var index = this.parent.child.indexOf(this);
			if (index >= 0){
				this.parent.child.splice(index, 1);
			}
		}
		if (parent == null){
			this.parent = bcnGameObjectMng.transform;
		}
		else{
			this.parent = parent;
		}
		this.parent.child.push(this);
		this.forceUpdate();
	}
	
	Transform.prototype.forceUpdate = function() {
		this.depth = this.localDepth + this.parent.depth;
		this.position.x = this.localPosition.x + this.parent.position.x;
		this.position.y = this.localPosition.y + this.parent.position.y;
		this.lossyScale.x = this.localScale.x * this.parent.lossyScale.x;
		this.lossyScale.y = this.localScale.y * this.parent.lossyScale.y;
		for (var idx = 0; idx < this.child.length; ++idx){
			this.child[idx].forceUpdate();
		}
	}
	
	Transform.prototype.findChild = function(name) {
		for (var idx = 0; idx < this.child.length; ++idx){
			console.log(this.child[idx].gameobject.name);
			if (this.child[idx].gameobject.name == name){
				return this.child[idx];
			}
		}
		return null;
	}
	
	Transform.prototype.update = function() {
		
	}
	
	Transform.prototype.lateUpdate = function() {
		
	}
	
	return {
		Transform : Transform
	}
})