/**
 * 
 */
define(["bcnew/bcnewEntity"], function(bcnewEntity) {
	
	function Action(gameobject){
		this.gameobject = gameobject;
		this.next = null;
	}
	
	Action.prototype.isCompleted = function() {
		return false;
	}
	
	Action.prototype.init = function() {
		
	}
	
	Action.prototype.update = function() {
		
	}
	
	Action.prototype.setNext = function(action) {
		this.next = action;
	}
	
	Action.prototype.getNext = function() {
		return this.next;
	}
	
	function FrameAnimCfg(sprite, keyTime){
		this.sprite = sprite;
		this.keyTime = keyTime;
	}
	
	function FrameAnimAction(gameobject, framAnimArr, lifeTime){
		Action.call(this, gameobject);
		this.framAnimArr = framAnimArr;
		this.framAnimArr.sort(function(l, r) {
			return l.keyTime - r.keyTime;
		});
		this.curTime = 0;
		this.frameTime = 0;
		this.frameIdx = 0;
		this.isLoop = lifeTime == null ? true : false;
		this.lifeTime = lifeTime == null ? 0 : lifeTime;
	}
	
	FrameAnimAction.prototype = new Action();
	
	FrameAnimAction.prototype.init = function() {
		this.curTime = bcnTimer.getCurTime();
	}
	
	FrameAnimAction.prototype.isCompleted = function() {
		return this.isLoop == false && this.lifeTime <= 0;
	}
	
	FrameAnimAction.prototype.update = function() {
		this.frameTime += bcnTimer.getFrameTime();
		if (this.isLoop == false){
			this.lifeTime -= bcnTimer.getFrameTime();
			if (this.lifeTime <= 0){
				return ;
			}
		}
		if (this.frameTime > this.framAnimArr[this.frameIdx].keyTime){
			if (this.frameIdx + 1 == this.framAnimArr.length){
				this.frameTime -= this.framAnimArr[this.frameIdx].keyTime;
				this.frameIdx = 0;
				this.freshSprite();
			}
			else if (this.frameTime > this.framAnimArr[this.frameIdx + 1].keyTime){
				this.frameIdx++;
				this.freshSprite();
			}
		}
	}
	
	FrameAnimAction.prototype.freshSprite = function() {
		if (this.gameobject != null && 
			this.gameobject.renderer != null){
			this.gameobject.renderer.setSprite(this.framAnimArr[this.frameIdx].sprite);
		}
	}
	
	function MoveCfg(track, speed, isLocal) {
		this.track = track;
		this.speed = speed;
		this.isLocal = isLocal;
	}
	
	function MoveAction(gameobject, moveCfg){
		Action.call(this, gameobject);
		this.moveCfg = moveCfg;
		this.completed = false;
		this.curDest = null;
	}
	
	MoveAction.prototype = new Action();
	
	MoveAction.prototype.update = function() {
		if (this.curDest == null){
			this.curDest = this.moveCfg.track.shift();
		}
		var leftTime = this.move(this.gameobject.transform, 
				this.curDest, 
				this.moveCfg.speed, 
				bcnTimer.getFrameTime(),
				this.moveCfg.isLocal);
		if (leftTime > 0){
			if (this.moveCfg.track.length == 0){
				this.completed = true;
				return;
			}
			this.curDest = this.moveCfg.track.shift();
			this.move(this.gameobject.transform, 
					this.curDest, 
					this.moveCfg.speed, 
					leftTime,
					this.moveCfg.isLocal);
		}
	}
	
	MoveAction.prototype.move = function(trans, tarPos, spd, time, isLocal) {
		throw "empty";
		return 0;
	}
	
	function BlinkCfg(dest, isLocal) {
		this.dest = dest;
		this.isLocal = isLocal;
	}
	
	function BlinkAction(gameobject, blinkCfg){
		Action.call(this, gameobject);
		this.blinkCfg = blinkCfg;
		this.completed = false;
	}
	
	BlinkAction.prototype = new Action();
	
	FrameAnimAction.prototype.isCompleted = function() {
		return this.completed;
	}
	
	BlinkAction.prototype.update = function() {
		if (this.completed == false){
			this.completed = true;
			if (this.gameobject == null ||
				this.gameobject.transform == null){
				return;
			}
			if (this.blinkCfg.isLocal){
				this.gameobject.transform.setLocalPosition(this.blinkCfg.dest);
			}
			else{
				this.gameobject.transform.setPosition(this.blinkCfg.dest);
			}
		}
	}
	
	function Animation(){
		bcnewEntity.Component.call(this, "Animation", "Animation");
		this.actions = new Array();
		this.curentAction = null;
	}
	
	Animation.prototype = new bcnewEntity.Component();
	
	Animation.prototype.addAction = function (action){
		this.actions.push(action);
	}
	
	Animation.prototype.removeAction = function(action) {
		var idx = this.actions.indexOf(action);
		if (idx >= 0){
			this.actions.splice(idx, 1);
		}
	}
	
	Animation.prototype.removeActionByIdx = function(idx) {
		if (idx >= 0 && idx < this.actions.length){
			this.actions.splice(idx, 1);
		}
	}
	
	Animation.prototype.getAction = function(idx) {
		if (idx < 0 || idx >= this.actions.length){
			return null;
		}
		return this.actions[idx];
	}
	
	Animation.prototype.update = function() {
		this.onMainUpdate();
		for (var idx = this.actions.length - 1; idx >= 0; --idx){
			this.actions[idx].update();
			if (this.actions[idx].completed){
				if (this.actions[idx].next != null){
					this.actions[idx] = this.actions[idx].next;
				}
				else{
					this.actions.splice(idx, 1);
				}
			}
		}
	}
	
})