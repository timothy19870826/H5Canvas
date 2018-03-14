/**
 * 
 */
define(["bcnew/bcnewEntity"], function(bcnewEntity) {
	
	
	function Timer(id, callback, callbackArg, interval, count) {
		this.id = id;
		this.dead = false;
		this.active = true;
		this.callback = callback;
		this.callbackArg = callbackArg;
		this.interval = interval;
		this.count = count;
		this.passedTime = 0;
	}
	
	Timer.prototype.update = function() {
		this.passedTime += bcnTimer.deltaTime;
		if (this.passedTime >= this.interval){
			if (this.callback != null){
				this.callback(this.callbackArg);
			}
			this.passedTime -= this.interval;
			if (this.count > 0){
				this.count--;
				if (this.count == 0){
					this.dead = true;
				}
			}
		}
	}
	
	
	function TimerService() {
		bcnewEntity.Entity.call(this, "TimerService");
		this.timerList = new Array();
		this.timeSinceLoad = 0;
		this.deltaTime = 0;
		this.timerId = 0;
		if (window.bcnTimer == null){
			window.bcnTimer = this;
		}
		else {
			throw "TimerService registed";
		}
	}
	
	TimerService.prototype = new bcnewEntity.Entity();
	
	TimerService.prototype.onInit = function() {
		var date = new Date();
		this.timeSinceLoad = date.getTime();
	}
	
	TimerService.prototype.onUpdate = function() {
		var date = new Date();
		this.deltaTime = date.getTime() - this.timeSinceLoad;
		this.timeSinceLoad = date.getTime();	
		for (var idx = this.timerList.length - 1; idx >= 0; idx--){
			if (this.timerList[idx].dead){
				this.timerList.splice(idx, 1);
			}
			else if (this.timerList[idx].active){
				this.timerList[idx].update();
			}
		}	
	}
	
	TimerService.prototype.getTimeSinceLoad = function() {
		return this.timeSinceLoad;
	}
	
	TimerService.prototype.getDeltaTime = function() {
		return this.deltaTime;
	}
	
	TimerService.prototype.addTimer = function(callback, callbackArg, interval, count) {
		this.timerId++;
		var timer = new Timer(this.timerId, callback, callbackArg, interval, count);
		this.timerList.push(timer);
		return this.timerId;
	}
	
	TimerService.prototype.removeTimerById = function(timerId) {
		for (var idx = 0; idx < this.timerList.length; idx++){
			if (this.timerList[idx].id == timerId){
				this.timerList[idx].dead = true;
				return;
			}
		}
	}
	
	return {
		Timer : TimerService
	}
})