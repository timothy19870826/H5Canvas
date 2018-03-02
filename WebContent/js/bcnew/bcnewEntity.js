/**
 * 
 */

define(function (){
	
	function Entity(name){
		this.name = name | "entity";
		this.active = true;
		this.dead = false;
		this.parent = null;
		this.children = new Array();
	};
	
	Entity.prototype.getName = function(){
		return this.name;
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
		console.log(this.name + "init");
	};
	
	Entity.prototype.update = function(){
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
	};
	
	return {Entity : Entity};
	
});