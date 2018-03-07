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
		this.changed = false;
		this.position = new bcnewEntity.Vector2(0, 0);
		this.localPosition = new bcnewEntity.Vector2(0, 0);
		this.lossyScale = new bcnewEntity.Vector2(1, 1);
		this.localScale = new bcnewEntity.Vector2(1, 1);
		this.parent = null;
		this.child = new Array();
	}
	
	Transform.prototype = new bcnewEntity.Component();
	
	Transform.prototype.hasChanged = function() {
		return this.changed;
	}
	
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
	
	Transform.prototype.setPosition = function(position) {
		this.position.x = position.x;
		this.position.y = position.y;
		this.localPosition.x = position.x - this.parent.position.x;
		this.localPosition.y = position.y - this.parent.position.y;
		this.changed = true;
	}
	
	Transform.prototype.getPosition = function() {
		return this.position;
	}
	
	Transform.prototype.setLocalPosition = function(position) {
		this.localPosition = position;
		this.position.x = position.x + this.parent.position.x;
		this.position.y = position.y + this.parent.position.y;
		this.changed = true;
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
		this.changed = true;
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
		this.localPosition.x = this.position.x - this.parent.position.x;
		this.localPosition.y = this.position.y - this.parent.position.y;
		this.localScale.x = this.lossyScale.x / this.parent.lossyScale.x;
		this.localScale.y = this.lossyScale.y / this.parent.lossyScale.y;
		this.changed = true;
	}
	
	Transform.prototype.update = function() {
		
	}
	
	Transform.prototype.lateUpdate = function() {
		
	}	
	
	return {
		Transform : Transform
	}
})