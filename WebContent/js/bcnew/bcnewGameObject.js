/**
 * 
 */
define(["bcnew/bcnewEntity", "bcnew/bcnewTransform"], function(bcnewEntity, bcnewTransform) {

	function GameObject(name){
		bcnewEntity.Entity.call(this, "GameObject", name);
		this.typeName = "GameObject";
		this.name = name;
		this.dead = false;
		this.active = true;
		this.compArr = new Array();
		this.renderer = null;
		this.collider = null;
		this.animation = null;
		this.transform = new bcnewTransform.Transform();
		if (window.bcnGameObjectMng != null){
			this.transform.setParent(bcnGameObjectMng.transform);
		}
		this.addComp(this.transform);
	}
	
	GameObject.prototype.addComp = function(component) {
		if (this.compArr.indexOf(component) >= 0){
			return;
		}
		this.compArr.push(component);
		component.gameobject = this;
		component.init();
	}
	
	GameObject.prototype.createComp = function(compName) {
		console.log(compName + "1");
		switch (compName){
			case "Collider":
				if (this.collider != null){
					return;
				}
				break;
			case "Renderer":
				if (this.renderer != null){
					return;
				}
				break;
			case "Animation":
				if (this.animation != null){
					return;
				}
				break;
		}
		
		var component = bcnewEntity.createComponent(compName);
		if (component == null){
			console.log(compName + "2");
			return;
		}
		console.log(component);
		this.compArr.push(component);
		
		switch (compName){
			case "Collider":
				this.collider = component;
				break;
			case "Renderer":
				this.renderer = component;
				break;
			case "Animation":
				this.animation = component;
				break;
		}
		component.gameobject = this;
		component.init();
		return component;
	}
	
	GameObject.prototype.removeComp = function(component) {
		var idx = this.compArr.indexOf(component);
		if (idx < 0){
			return;
		}
		this.compArr.splice(idx, 1);
		component.destroy();
	}
	
	GameObject.prototype.findCompByName = function(typeName) {
		for (var idx = 0; idx < this.compArr.length; ++idx){
			if (this.compArr[idx] == null){
				continue;
			}
			else if (this.compArr[idx].active && 
					this.compArr[idx].dead == false && 
					this.compArr[idx].getTypeName() == typeName){
				return this.compArr[idx];
			}
		}
		return null;
	}
	
	GameObject.prototype.update = function (){
		//console.log("GameObject->onUpdate:" + this.name);
		for (var idx = 0; idx < this.compArr.length; ++idx){
			if (this.compArr[idx] == null){
				continue;
			}
			else if (this.compArr[idx].active && 
					this.compArr[idx].dead == false){
				this.compArr[idx].update();
			}
		}
		if (this.transform == null){
			return;
		}
		var gameobject;
		for (var idx = 0; idx < this.transform.child.length; ++idx){
			gameobject = this.transform.child[idx].gameobject;
			if (gameobject != null && gameobject.active && gameobject.dead == false){
				gameobject.update();
			}
		}
	}
	
	GameObject.prototype.lateUpdate = function (){
		for (var idx = 0; idx < this.compArr.length; ++idx){
			if (this.compArr[idx] == null){
				continue;
			}
			else if (this.compArr[idx].active && 
					this.compArr[idx].dead == false){
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
				component.gameobject = null;
			}
		}
		if (this.transform == null){
			return;
		}
		var gameobject;
		for (var idx = 0; idx < this.transform.child.length; ++idx){
			gameobject = this.transform.child[idx].gameobject;
			if (gameobject != null && gameobject.active && gameobject.dead == false){
				gameobject.lateUpdate();
			}
		}
	}
	
	GameObject.prototype.onDestroy = function() {
		for (var idx = 0; idx < this.compArr.length; ++idx){
			if (this.compArr[idx] == null){
				continue;
			}
			this.compArr[idx].destroy();
		}
		this.compArr = null;
	}
	
	GameObject.prototype.destoryGameObject = function(gameobject) {
		bcnGameObjectMng.destoryGameObject(gameobject);
	}
	

	function GameObjectMng(){
		bcnewEntity.Entity.call(this, "GameObjectMng");
		this.typeName = "GameObjectMng";
		this.root = new GameObject("hiddenRoot");
		this.transform = this.root.transform;
		this.deadArr = new Array();
		if (window.bcnGameObjectMng != null){
			throw "GameObjectMng registed";
		}
		else{
			window.bcnGameObjectMng = this;
		}
	}
	
	GameObjectMng.prototype = new bcnewEntity.Entity();
	
	GameObjectMng.prototype.onUpdate = function() {
		this.root.update();
	}

	GameObjectMng.prototype.onLateUpdate = function() {
		this.root.lateUpdate();

		var gameobject;
		var length = this.deadArr.length;
		for (var idx = this.deadArr.length - 1; idx >= 0; --idx){
			gameobject = this.deadArr[idx].gameobject;
			if (gameobject != null){
				gameobject.destroy();
			}
		}
		this.deadArr.splice(0, length);
	}
	
	GameObjectMng.prototype.destoryGameObject = function(gameobject) {
		gameobject.dead = true;
		var idx = deadArr.indexOf(gameobject);
		if (idx < 0){
			deadArr.push(gameobject);
		}
	}
	
	GameObjectMng.prototype.findGameObject = function(path) {
		var filterArr = path.split("/");
		var obj = this.transform;
		for (var idx = 0; idx < filterArr.length; ++idx){
			obj = obj.findChild(filterArr[idx]);
			if (obj == null){
				return null;
			}
		}
	}
	
	return {
		GameObject : GameObject,
		GameObjectMng : GameObjectMng
	}
})