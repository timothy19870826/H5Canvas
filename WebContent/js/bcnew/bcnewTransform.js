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
		this.posChanged = false;
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
		this.localDepth = depth;
		if (this.parent != null){
			this.localDepth -= this.parent.getDepth();
		}
		this.freshChildDepth();
	}
	
	Transform.prototype.getDepth = function() {
		return this.depth;
	}
	
	Transform.prototype.setLocalDepth = function(depth) {
		this.localDepth = depth;
		this.depth = depth;
		if (this.parent != null){
			this.depth += this.parent.getDepth();
		}
		this.freshChildDepth();
	}
	
	Transform.prototype.getLocalDepth = function() {
		return this.localDepth;
	}
	
	Transform.prototype.setPosition = function(position) {
		this.position.x = position.x;
		this.position.y = position.y;
		this.localPosition.x = position.x;
		this.localPosition.y = position.y;
		if (this.parent != null){
			var rootPos = this.parent.getPosition();
			this.localPosition.x -= rootPos.x;
			this.localPosition.y -= rootPos.y;
		}
		this.freshChildPos();
	}
	
	Transform.prototype.getPosition = function(forceUpdate) {
		return this.position;
	}
	
	Transform.prototype.setLocalPosition = function(position) {
		this.position.x = position.x;
		this.position.y = position.y;
		this.localPosition.x = position.x;
		this.localPosition.y = position.y;
		if (this.parent != null){
			var rootPos = this.parent.getPosition();
			this.position.x += rootPos.x;
			this.position.y += rootPos.y;
		}
		this.freshChildPos();
	}
	
	Transform.prototype.getLocalPosition = function() {
		return this.localPosition;
	}
	
	Transform.prototype.getLossyScale = function() {
		return this.lossyScale;
	}
	
	Transform.prototype.setLocalScale = function(scale) {
		this.lossyScale.x = scale.x;
		this.lossyScale.y = scale.y;
		this.localScale.x = scale.x;
		this.localScale.y = scale.y;
		if (this.parent != null){
			var rootScale = this.parent.getLossyScale();
			this.lossyScale.x *= rootScale.x;
			this.lossyScale.y *= rootScale.y;
		}
		this.freshChildScale();
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
			this.parent = null;
			this.localPosition.x = this.position.x;
			this.localPosition.y = this.position.y;
			this.localScale.x = this.lossyScale.x;
			this.localScale.y = this.lossyScale.y;
			this.localDepth = this.depth;
		}
		if (parent == null){
			this.parent = bcnGameObjectMng.transform;
		}
		else{
			this.parent = parent;
		}
		this.parent.child.push(this);
		var rootPos = this.parent.getPosition();
		this.localPosition.x -= rootPos.x;
		this.localPosition.y -= rootPos.y;
		var rootScale = this.parent.getLossyScale();
		this.localScale.x /= rootScale.x;
		this.localScale.y /= rootScale.y;
		this.localDepth -= this.parent.getDepth();
		
		this.freshChild();
	}
	
	Transform.prototype.getChildCount = function() {
		return this.child.length;
	}
	
	Transform.prototype.getChildByIdx = function(idx) {
		if (idx < 0 || idx >= this.child.length){
			return null;
		}
		return this.child[idx];
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
	
	Transform.prototype.freshChild = function() {
		for (var idx = 0; idx < this.child.length; ++idx){
			console.log(this.child[idx].gameobject.name);
			this.child[idx].setLocalPosition(this.child[idx].localPosition);
			this.child[idx].setLocalScale(this.child[idx].localScale);
			this.child[idx].setLocalDepth(this.child[idx].localDepth);
			console.log(this.child[idx]);
			this.child[idx].freshChild();
		}
	}
	
	Transform.prototype.freshChildPos = function(){
		for (var idx = 0; idx < this.child.length; ++idx){
			this.child[idx].setLocalPosition(this.child[idx].localPosition);
			this.child[idx].freshChildPos();
		}
	}
	
	Transform.prototype.freshChildScale = function() {
		for (var idx = 0; idx < this.child.length; ++idx){
			this.child[idx].setLocalScale(this.child[idx].localScale);
			this.child[idx].freshChildScale();
		}
	}
	
	Transform.prototype.freshChildDepth = function() {
		for (var idx = 0; idx < this.child.length; ++idx){
			this.child[idx].setLocalDepth(this.child[idx].localDepth);
			this.child[idx].freshChildDepth();
		}
	}
	
	bcnewEntity.regComponent("Transform", function (){
		return new bcnewTransform.Transform();
	})
	
	return {
		Transform : Transform
	}
})