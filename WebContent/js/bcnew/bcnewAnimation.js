/**
 * 
 */
define(["bcnew/bcnewEntity", "bcnew/bcnewEventCenter"], function(bcnewEntity, bcnewEventCenter) {
	
	function Action(){
		this.gameobject = null;
		this.next = null;
		this.onCompleted = new bcnewEventCenter.EvtListenerGroup(0);
		this.child = new Array();
	}
	
	Action.prototype.isCompleted = function() {
		return false;
	}
	
	Action.prototype.init = function() {
		this.onInit();
		for (var idx = 0; idx < this.child.length; ++idx){
			this.child[idx].gameobject = this.gameobject;
			this.child[idx].init();
		}
	}
	
	Action.prototype.onInit = function() {
		
	}
	
	Action.prototype.reset = function() {
		this.onReset();
		for (var idx = 0; idx < this.child.length; ++idx){
			this.child[idx].reset();
		}
	}
	
	Action.prototype.onReset = function() {
		
	}
	
	Action.prototype.update = function() {
		this.onUpdate();
		for (var idx = this.child.length - 1; idx >= 0; --idx){
			this.child[idx].update();
			if (this.child[idx].isCompleted()){
				if (this.child[idx].getNext() == null){
					this.child.splice(idx, 1);
				}
				else{
					this.child[idx] = this.child[idx].getNext();
					this.child[idx].gameobject = this.gameobject;
					this.child[idx].init();
				}
			}
		}
	}
	
	Action.prototype.onUpdate = function() {
		
	}
	
	Action.prototype.setNext = function(action) {
		this.next = action;
	}
	
	Action.prototype.getNext = function() {
		return this.next;
	}
	
	Action.prototype.addChild = function(action) {
		this.child.push(action);
	}
	
	function FrameCfg(sprite, keyTime){
		this.sprite = sprite;
		this.keyTime = keyTime;
	}
	
	function FrameAnimCfg(duration, frameArr){
		this.duration = duration;
		this.frameArr = frameArr;
	}
	
	function FrameAnimAction(frameAnimCfg){
		Action.call(this);
		this.frameArr = frameAnimCfg.frameArr;
		this.frameArr.sort(function(l, r) {
			return l.keyTime - r.keyTime;
		});
		this.curTime = 0;
		this.frameTime = 0;
		this.frameIdx = 0;
		this.isLoop = frameAnimCfg.duration == null ? true : false;
		this.duration = frameAnimCfg.duration == null ? 0 : frameAnimCfg.duration;
		this.leftTime = this.duration;
	}
	
	FrameAnimAction.prototype = new Action();
	
	FrameAnimAction.prototype.onInit = function() {
		this.curTime = bcnTimer.getTimeSinceLoad();
	}
	
	FrameAnimAction.prototype.onReset = function() {
		this.leftTime = this.duration;
		this.frameTime = 0;
		this.frameIdx = 0;
	}
	
	FrameAnimAction.prototype.isCompleted = function() {
		return this.isLoop == false && this.leftTime <= 0;
	}
	
	FrameAnimAction.prototype.onUpdate = function() {
		if (this.isCompleted()){
			return;
		}
		this.frameTime += bcnTimer.getDeltaTime();
		if (this.frameTime > this.frameArr[this.frameIdx].keyTime){
			if (this.frameIdx + 1 == this.frameArr.length){
				this.frameTime -= this.frameArr[this.frameIdx].keyTime;
				this.frameIdx = 0;
				this.freshSprite();
			}
			else if (this.frameTime > this.frameArr[this.frameIdx + 1].keyTime){
				this.frameIdx++;
				this.freshSprite();
			}
		}
		if (this.isLoop == false){
			this.leftTime -= bcnTimer.getDeltaTime();
			if (this.leftTime <= 0){
				this.onCompleted.dispacthMessage(this);
			}
		}
	}
	
	FrameAnimAction.prototype.freshSprite = function() {
		if (this.gameobject != null && 
			this.gameobject.renderer != null){
			this.gameobject.renderer.setSprite(this.frameArr[this.frameIdx].sprite);
		}
	}
	
	function MoveCfg(track, speed, isLocal) {
		this.track = track;
		this.speed = speed;
		this.isLocal = isLocal;
	}
	
	function MoveAction(moveCfg){
		Action.call(this);
		this.moveCfg = moveCfg;
		this.curIdx = 0;
		this.lastPos = new bcnewEntity.Vector2(0, 0);
		this.totalTime = 0;
		this.passedTime = 0;
	}
	
	MoveAction.prototype = new Action();
	
	MoveAction.prototype.isCompleted = function() {
		return this.curIdx >= this.moveCfg.track.length;
	}
	
	MoveAction.prototype.onReset = function() {
		this.curIdx = 0;
	}
	
	MoveAction.prototype.onInit = function() {
		this.curIdx = 0;
		var pos = this.moveCfg.isLocal ? this.gameobject.transform.getLocalPosition() : this.gameobject.transform.getPosition();
		this.lastPos.x = pos.x;
		this.lastPos.y = pos.y;
		this.totalTime = costTime(
				this.lastPos,
				this.moveCfg.track[this.curIdx], 
				this.moveCfg.speed);
		this.passedTime = 0;
	}
	
	MoveAction.prototype.onUpdate = function() {
		if (this.isCompleted()){
			return;
		}
		this.passedTime += bcnTimer.getDeltaTime();
		if (this.passedTime > this.totalTime){
			if (this.moveCfg.isLocal){
				this.gameobject.transform.setLocalPosition(this.moveCfg.track[this.curIdx]);
			}
			else{
				this.gameobject.transform.setPosition(this.moveCfg.track[this.curIdx]);
			}
			this.curIdx++;
			if (this.isCompleted()){
				this.onCompleted.dispacthMessage(this);
				return;
			}
			this.passedTime -= this.totalTime;
			var pos = this.moveCfg.isLocal ? this.gameobject.transform.getLocalPosition() : this.gameobject.transform.getPosition();
			this.lastPos.x = pos.x;
			this.lastPos.y = pos.y;
			this.totalTime = costTime(
					this.lastPos,
					this.moveCfg.track[this.curIdx], 
					this.moveCfg.speed);
		}

		if (this.moveCfg.isLocal){
			this.gameobject.transform.setLocalPosition(
					Lerp(this.lastPos,
						this.moveCfg.track[this.curIdx],
						this.passedTime / this.totalTime));
		}
		else{
			this.gameobject.transform.setPosition(
					Lerp(this.lastPos,
						this.moveCfg.track[this.curIdx],
						this.passedTime / this.totalTime));
		}
		
	}
	
	function Lerp(srcPos, dstPos, percent){
		var pos = new bcnewEntity.Vector2(srcPos.x, srcPos.y);
		pos.x += (dstPos.x - srcPos.x) * percent;
		pos.y += (dstPos.y - srcPos.y) * percent;
		return pos;
	}
	
	function costTime(srcPos, dstPos, speed){
		var length = Math.pow(dstPos.x - srcPos.x, 2) + Math.pow(dstPos.y - srcPos.y, 2);
		length = Math.sqrt(length);
		return length / speed * 1000;
	}
	
	
	function BlinkCfg(dest, isLocal) {
		this.dest = dest;
		this.isLocal = isLocal;
	}
	
	function BlinkAction(blinkCfg){
		Action.call(this);
		this.blinkCfg = blinkCfg;
		this.completed = false;
	}
	
	BlinkAction.prototype = new Action();
	
	BlinkAction.prototype.isCompleted = function() {
		return this.completed;
	}
	
	BlinkAction.prototype.onReset = function() {
		this.completed = false;
	}
	
	BlinkAction.prototype.onUpdate = function() {
		if (this.completed){
			return;
		}

		if (this.gameobject != null &&
			this.gameobject.transform != null){
			if (this.blinkCfg.isLocal){
				this.gameobject.transform.setLocalPosition(this.blinkCfg.dest);
			}
			else{
				this.gameobject.transform.setPosition(this.blinkCfg.dest);
			}
		}
		
		this.completed = true;
		this.onCompleted.dispacthMessage(this);
	}
	
	function Animation(){
		bcnewEntity.Component.call(this, "Animation", "Animation");
		this.actions = new Array();
		this.currentAction = null;
	}
	
	bcnewEntity.regComponent("Animation", function (){
		return new bcnewAnimation.Animation();
	})
	
	Animation.prototype = new bcnewEntity.Component();
	
	Animation.prototype.addAction = function (action){
		action.gameobject = this.gameobject;
		action.init();
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
		for (var idx = this.actions.length - 1; idx >= 0; --idx){
			this.actions[idx].update();
			if (this.actions[idx].isCompleted()){
				if (this.actions[idx].getNext() == null){
					this.actions.splice(idx, 1);
				}
				else{
					this.actions[idx] = this.actions[idx].getNext();
					this.actions[idx].gameobject = this.gameobject;
					this.actions[idx].init();
				}
			}
		}
	}
	
	return {
		Animation : Animation,
		Action : Action,
		FrameAnimAction : FrameAnimAction,
		FrameAnimCfg : FrameAnimCfg,
		FrameCfg : FrameCfg,
		MoveAction : MoveAction,
		MoveCfg : MoveCfg,
		BlinkAction : BlinkAction,
		BlinkCfg : BlinkCfg,
	}
})