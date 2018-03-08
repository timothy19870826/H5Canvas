/**
 * 
 */
define(["bcnew/bcnewEntity"], function(bcnewEntity) {
	
	function Collider(){
		bcnewEntity.Component.call(this, "Collider");
		this.changed = false;
		this.offset = new bcnewEntity.Vector2(0, 0);
		this.bound = new bcnewEntity.Rect(0, 0, 100, 100);
		this.curBound = new bcnewEntity.Rect(0, 0, 100, 100);
		this.autoCollider = false;
		this.trigger = true;
		this.lastTime = 0;
		this.onTouchStart = null;
		this.onTouchEnd = null;
		this.onClick = null;
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
	
	Collider.prototype.getCurBound = function() {
		var position = this.gameobject.transform.getPosition();
		var scale = this.gameobject.transform.getLossyScale();
		if (this.autoCollider){
			var size = this.gameobject.transform.getSize();
			this.curBound.x = position.x;
			this.curBound.y = position.y;
			this.curBound.width = size.x * scale.x;
			this.curBound.height = size.y * scale.y;
			return this.curBound;
		}
		this.curBound.x = this.bound.x + position.x;
		this.curBound.y = this.bound.y + position.y;
		this.curBound.width = this.bound.width * scale.x;
		this.curBound.height = this.bound.height * scale.y;		
		return this.curBound;
	}
	
	Collider.prototype.isContainPoint = function(point) {
		return this.getCurBound().containPoint(point);
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
	
	ColliderMng.prototype.update = function() {
		if (bcnInput.isMouseDown()){
			var touchPos = bcnewClient.inputPos2Game(bcnInput.getMousePos());
			var collider = filterCollider(this.colliderArr, touchPos);
			console.log(collider);
			if (collider == null){
				return;
			}
			if (collider.onTouchStart != null){
				collider.onTouchStart(touchPos);
			}
			if (collider.onClick != null){
				var date = new Date();
				collider.lastTime = date.getTime();
			}
		}
		if (bcnInput.isMouseUp()){
			var touchPos = bcnewClient.inputPos2Game(bcnInput.getMousePos());
			var collider = filterCollider(this.colliderArr, touchPos);
			console.log(collider);
			if (collider == null){
				return;
			}
			if (collider.onTouchEnd != null){
				collider.onTouchEnd(touchPos);
			}
			if (collider.onClick != null){
				var date = new Date();
				if (date.getTime() - collider.lastTime < 1000){
					collider.onClick(touchPos);
				}
			}
		}
	}
	
	ColliderMng.prototype.isInCollider = function(pos) {
		return filterCollider(this.colliderArr, pos);
	}
	
	function filterCollider(colliderArr, point){
		var res = -1;
		var y = 10000;
		for (var idx = colliderArr.length - 1; idx >= 0; --idx){
			if (colliderArr[idx].trigger &&
				colliderArr[idx].isContainPoint(point) &&
				colliderArr[idx].gameobject.transform.position.y < y){
				res = idx;
				y = colliderArr[idx].gameobject.transform.position.y;
			}
		}
		console.log(res);
		if (res == -1){
			return null;
		}
		return colliderArr[res];
	}
	
	return {
		Collider : Collider,
		ColliderMng : ColliderMng
	}
})