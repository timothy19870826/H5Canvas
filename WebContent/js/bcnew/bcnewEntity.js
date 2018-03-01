/**
 * 
 */

define(function (){
	
	function Entity(name){
		this.name = name | "entity";
	};
	
	Entity.prototype.getName = function(){
		return this.name;
	}

	Entity.prototype.init = function(){
		console.log(this.name + "init");
	};
	
	Entity.prototype.update = function(){
		
	};
	
	Entity.prototype.lateUpdate = function(){
		
	};
	
	Entity.prototype.destroy = function(){
		console.log("destroy");
	};
	
	return {Entity : Entity};
	
});