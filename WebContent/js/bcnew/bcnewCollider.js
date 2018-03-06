/**
 * 
 */
define(["bcnew/bcnewEntity"], function(bcnewEntity) {
	
	function Collider(){
		bcnewEntity.Component.call(this, "Collider");
		this.changed = false;
		this.offset = new bcnewEntity.Vector2(0, 0);
		this.bound = new bcnewEntity.Rect(0, 0, 100, 100);
	}
	
	Collider.prototype = new bcnewEntity.Component();
	
	Collider.prototype.init = function() {
		bcnColliderMng.addCollider(this);
	}
	
	Collider.prototype.destroy = function() {
		bcnColliderMng.removeCollider(this);
	}
		
	Collider.prototype.setOffset = function(offset) {
		this.offset.x = offset.x;
		this.offset.y = offset.y;
	}
	
	Collider.prototype.getOffset = function() {
		return this.offset;
	}
	
	Collider.prototype.setBound = function(x, y, width, height) {
		this.bound.x = x;
		this.bound.y = y;
		this.bound.width = width;
		this.bound.height = height;
	}
	
	Collider.prototype.getBound = function() {
		return this.bound;
	}
	
	Collider.prototype.isContainPoint = function(x, y) {
		return x > this.bound.x && 
		y > this.bound.y && 
		x - this.bound.x < this.bound.width && 
		y - this.bound.y < this.bound.height;
	}
	
	function ColliderMng(){
		bcnewEntity.Entity.call(this, "ColliderMng");
		this.colliderArr = new Array();
		if (window.bcnColliderMng != null){
			throw "ColliderMng registed";
		}
		else{
			window.bcnColliderMng = this;
		}
	}
	
	ColliderMng.prototype = new bcnewEntity.Entity();
	
	ColliderMng.prototype.addCollider = function(collider) {
		if (this.colliderArr.indexOf(collider) < 0){
			this.colliderArr.push(collider);
		}
	}
	
	ColliderMng.prototype.removeCollider = function(collider) {
		var idx = this.colliderArr.indexOf(collider);
		if (idx >= 0){
			this.colliderArr.splice(idx, 1);
		}
	}
	
	ColliderMng.prototype.isInCollider = function(pos) {
		this.colliderArr.sort(function(l, r) {
			return l.gameobject.transform.getPosition().y - r.gameobject.transform.getPosition().y
		});
		for (var idx = this.colliderArr.length - 1; idx >= 0; --idx){
			if (this.colliderArr[idx].isContainPoint(pos.x, pos.y)){
				return this.colliderArr[idx];
			}
		}
		return null;
	}
	
	return {
		Collider : Collider
	}
})