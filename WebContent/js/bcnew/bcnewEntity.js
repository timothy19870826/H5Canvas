/**
 * 
 */

define(function (){
	
	function Entity(typeName){
		this.typeName = typeName | "entity";
		this.active = true;
		this.dead = false;
		this.parent = null;
		this.children = new Array();
	};
	
	Entity.prototype.getTypeName = function(){
		return this.typeName;
	}
	
	Entity.prototype.addChild = function(entity){
		if (this.children.indexOf(entity) == -1){
			entity.parent = null;
			this.children.push(entity);
		}
	}
	
	Entity.prototype.removeChild = function(entity) {
		var idx = this.children.indexOf(entity);
		if (idx >= 0){
			entity.dead = true;
		}
	}

	Entity.prototype.init = function(){
		console.log(this.typeName + "init");
		this.onInit();
	};
	
	Entity.prototype.update = function(){
		this.onUpdate();
		if (this.children.length == 0){
			return;
		}
		for (var idx = this.children.length - 1; idx >= 0; --idx){
			if (this.children[idx].dead){
				this.children.splice(idx, 1);
			}
			else if (this.children[idx].active){
				this.children[idx].update();
			}
		}
	};
	
	Entity.prototype.lateUpdate = function(){
		this.onLateUpdate();
		if (this.children.length == 0){
			return;
		}
		for (var idx = this.children.length - 1; idx >= 0; --idx){
			if (this.children[idx].dead){
				this.children[idx].parent = null;
				this.children.splice(idx, 1);
			}
			else if (this.children[idx].active){
				this.children[idx].lateUpdate();
			}
		}
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
			alert("service:" + service.getTypeName());
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
		this.typeName = typeName | "Component";
		this.active = true;
		this.dead = false;
		this.parent = null;
		this.single = true;
	}
	
	Component.prototype.getTypeName = function(){
		return this.typeName;
	}
	
	Component.prototype.isSingle = function() {
		return this.single;
	}

	Component.prototype.init = function(){
		console.log(this.typeName + "init");
	};
	
	Component.prototype.update = function(){
	};
	
	Component.prototype.lateUpdate = function(){
	};
	
	Component.prototype.destroy = function(){
		console.log("destroy");
	};
	

	function GameObject(name){
		Entity.call(this, "GameObject");
		this.typeName = "GameObject";
		this.name = name | "GameObject";
		this.compArr = new Array();
	}

	GameObject.prototype = new Entity();
	
	GameObject.prototype.addComp = function(component) {
		if (component.isSingle() && this.compArr.indexOf(component) >= 0){
			return;
		}
		this.compArr.push(component);
		component.init();
	}
	
	GameObject.prototype.removeComp = function(component) {
		if (this.compArr.indexOf(component) < 0){
			return;
		}
		component.dead = true;
	}
	
	GameObject.prototype.findCompByName = function(typeName) {
		
	}
	
	GameObject.prototype.onUpdate = function (){
		for (var idx = 0; idx < this.compArr.length; ++idx){
			if (this.compArr[idx] == null){
				continue;
			}
			else if (this.compArr[idx].active && this.compArr[idx].dead == false){
				this.compArr[idx].update();
			}
		}
	}
	
	GameObject.prototype.onLateUpdate = function (){
		for (var idx = 0; idx < this.compArr.length; ++idx){
			if (this.compArr[idx] == null){
				continue;
			}
			else if (this.compArr[idx].active && this.compArr[idx].dead == false){
				this.compArr[idx].lateUpdate();
			}
		}
		for (var idx = this.compArr.length - 1; idx >= 0; --idx){
			var component = this.compArr[idx];
			if (component == null){
				this.compArr.splice(idx, 1);
			}
			else if (this.compArr[idx].dead){
				this.compArr.splice(idx, 1);
				component.destroy();
			}
		}
	}
	
	function Sprite(image, x, y, width, height){
		this.image = image;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	
	return {
		Entity : Entity,
		ServiceCenter : ServiceCenter,
		Component : Component,
		GameObject : GameObject,
		Sprite : Sprite
		};
	
});