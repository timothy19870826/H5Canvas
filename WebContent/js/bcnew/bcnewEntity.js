/**
 * 
 */

define(function (){
		
	function Vector2(x, y){
		this.x = x;
		this.y = y;
	}
	
	function Rect(x, y, width, height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	
	Rect.prototype.containPoint = function(point) {
		return point.x > this.x && 
		point.y > this.y && 
		point.x - this.x < this.width && 
		point.y - this.y < this.height;
	}
	
	function Entity(typeName, name){
		this.typeName = typeName == null ? "entity" : typeName;
		this.name = name == null ? this.typeName : name;
		this.active = true;
		this.dead = false;
	};
	
	Entity.prototype.getName = function() {
		return this.name;
	}
	
	Entity.prototype.getTypeName = function(){
		return this.typeName;
	}

	Entity.prototype.init = function(){
		console.log(this.typeName + "init");
		this.onInit();
	};	
	
	Entity.prototype.update = function(){
		this.onUpdate();
	};
	
	Entity.prototype.lateUpdate = function(){
		this.onLateUpdate();
	};
	
	Entity.prototype.destroy = function(){
		console.log("destroy");
		this.onDestroy();
	};
	
	Entity.prototype.onInit = function() {
		
	}
	
	Entity.prototype.onUpdate = function() {
		
	}
	
	Entity.prototype.onLateUpdate = function() {
		//console.log("update");
	}
	
	Entity.prototype.onDestroy = function() {
		
	}
	
	function ServiceCenter(){
		Entity.call(this, "ServiceManager");
		this.serviceArray = new Array();
	}
	
	ServiceCenter.prototype = new Entity();
		
	ServiceCenter.prototype.findService = function (service){
		for (var idx = 0; idx < this.serviceArray.length; ++idx){
			if (this.serviceArray[idx] == service){
				return idx;
			}
		}
		return -1;
	}
	
	ServiceCenter.prototype.findServiceByName = function (typeName){
		for (var idx = 0; idx < this.serviceArray.length; ++idx){
			if (this.serviceArray[idx].getTypeName() == name){
				return idx;
			}
		}
		return -1;
	}
	
	ServiceCenter.prototype.regService = function (service){
		var idx = this.findService(service);
		if (idx == -1){
			service.init();
			//alert("service:" + service.getTypeName());
			this.serviceArray.push(service);
		}
		else {
			throw service.getName() + "has registed";
		}
	}
	
	ServiceCenter.prototype.unregService = function (service){
		var idx = this.findService(service);
		if (idx >= 0){
			this.serviceArray[idx].dead = true;
		}
	}
	
	ServiceCenter.prototype.unregServiceByName = function (typeName){
		var idx = this.findServiceByName(typeName);
		if (idx >= 0){
			this.serviceArray[idx].dead = true;
		}
	}
	
	ServiceCenter.prototype.onUpdate = function (){
		for (var idx = 0; idx < this.serviceArray.length; ++idx){
			if (this.serviceArray[idx] == null){
				continue;
			}
			else if (this.serviceArray[idx].active && this.serviceArray[idx].dead == false){
				this.serviceArray[idx].update();
			}
		}
	}
	
	ServiceCenter.prototype.onLateUpdate = function (){
		for (var idx = 0; idx < this.serviceArray.length; ++idx){
			if (this.serviceArray[idx] == null){
				continue;
			}
			else if (this.serviceArray[idx].active && this.serviceArray[idx].dead == false){
				this.serviceArray[idx].lateUpdate();
			}
		}
		for (var idx = this.serviceArray.length - 1; idx >= 0; --idx){
			var service = this.serviceArray[idx];
			if (service == null){
				this.serviceArray.splice(idx, 1);
			}
			else if (this.serviceArray[idx].dead){
				this.serviceArray.splice(idx, 1);
				service.destroy();
			}
		}
	}
	
	function Component(typeName){
		this.typeName = typeName == null ? "Component" : typeName;
		this.active = true;
		this.dead = false;
		this.gameobject = null;
	}
	
	Component.prototype.getTypeName = function(){
		return this.typeName;
	}

	Component.prototype.init = function(){
		console.log(this.typeName + "init");
	};
	
	Component.prototype.destroy = function(){
		console.log("destroy");
	};

	Component.prototype.update = function(){
	};
	
	Component.prototype.lateUpdate = function(){
	};
	
	function ComponentFactory(){
		this.compTempList = new Array();
	}
	
	ComponentFactory.prototype.regComponent = function(compName, factoryFunc) {
		for (var idx = 0; idx < this.compTempList.length; ++idx){
			if (this.compTempList[idx].id == compName){
				alert("duplicate register comp:" + compName);
				this.compTempList[idx].func = factoryFunc;
				return;
			}
		}
		this.compTempList.push({id:compName, func:factoryFunc});
	}
	
	ComponentFactory.prototype.createComponent = function(compName) {
		for (var idx = 0; idx < this.compTempList.length; ++idx){
			if (this.compTempList[idx].id == compName){
				return this.compTempList[idx].func();
			}
		}
		console.log("can't find comp:" + compName);
		return null;
	}
	
	function regComponent(compName, factoryFunc) {
		if (window.bcnCompFactory == null){
			window.bcnCompFactory = new ComponentFactory();
		}
		window.bcnCompFactory.regComponent(compName, factoryFunc);
	}
	
	function createComponent(compName){
		if (window.bcnCompFactory != null){
			return window.bcnCompFactory.createComponent(compName);
		}
	}
	
	return {
		Vector2 : Vector2,
		Rect : Rect,
		Entity : Entity,
		ServiceCenter : ServiceCenter,
		Component : Component,
		regComponent : regComponent,
		createComponent : createComponent,
		};
	
});