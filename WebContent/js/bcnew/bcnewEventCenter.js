/**
 * 
 */
define(["bcnew/bcnewEntity"], function(bcnewEntity) {
	
	function ListenerTag(evtId, id) {
		this.evtId = evtId;
		this.id = id;
	}
	
	function EvtListener(id, callback, callbackArg) {
		this.id = id;
		this.callback = callback;
		this.callbackArg = callbackArg;
		this.dead = false;
	}
	
	EvtListener.prototype.onEvtMsg = function(evtMsg) {
		if (this.callback != null){
			this.callback(this.callbackArg, evtMsg);
		}
	}
	
	function EvtListenerGroup(evtId){
		this.evtId = evtId;
		this.list = new Array();
		this.listenerId = 0;
	}
	
	EvtListenerGroup.prototype.addListener = function(callback, callbackArg) {
		this.listenerId++;
		var listener = new EvtListener(this.listenerId, callback, callbackArg);	
		this.list.push(listener);
		return new ListenerTag(this.evtId, listener.id);
	}
	
	EvtListenerGroup.prototype.removeListenerById = function(listenerTag) {
		for (var idx = 0; idx < this.list.length; ++idx){
			if (this.list[idx].id == listenerTag.id){
				this.list[idx].dead = true;
			}
		}
	}
	
	EvtListenerGroup.prototype.clear = function() {
		for (var idx = 0; idx < this.list.length; ++idx){
			this.list[idx].dead = true;
		}
	}
	
	EvtListenerGroup.prototype.dispacthMessage = function(message) {
		for (var idx = this.list.length - 1; idx >= 0; --idx){
			if (this.list[idx].dead){
				this.list.splice(idx, 1);
			}
			else{
				this.list[idx].onEvtMsg(message);
			}
		}
	}
		
	
	function EventCenter() {
		bcnewEntity.Entity.call(this, "EvtListenerMng");
		this.listenerGroups = new Array();
	}
	
	EventCenter.prototype = new bcnewEntity.Entity();
		
	EventCenter.prototype.addListener = function(evtId, callback, callbackArg) {
		for (var idx = 0; idx < this.listenerGroups.length; ++idx){
			if (this.listenerGroups[idx].evtId == evtId){
				return this.listenerGroups[idx].addListener(callback, callbackArg);
			}
		}
		var group = new EvtListenerGroup(evtId);
		this.listenerGroups.push(group);
		return group.addListener(callback, callbackArg);
	}
	
	EventCenter.prototype.removeListenerById = function(listenerTag) {
		for (var idx = 0; idx < this.listenerGroups.length; ++idx){
			if (this.listenerGroups[idx].evtId == listenerTag.evtId){
				this.listenerGroups[idx].removeListenerById(listenerTag)
				break;
			}
		}
	}
	
	EventCenter.prototype.dispacthMessage = function(evtId, message) {
		for (var idx = 0; idx < this.listenerGroups.length; ++idx){
			if (this.listenerGroups[idx].evtId == listenerTag.evtId){
				this.listenerGroups[idx].dispacthMessage(message);
				break;
			}
		}
	}
	
	return {
		EventCenter : EventCenter,
		EvtListenerGroup : EvtListenerGroup,
	}
})