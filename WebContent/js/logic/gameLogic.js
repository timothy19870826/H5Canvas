/**
 * 
 */
define(["bcnew/bcnewEntity", "bcnew/bcnewGameObject", "bcnew/bcnewResource", "bcnew/bcnewRender"], 
function (bcnewEntity, bcnewGameObject, bcnewResource, bcnewRender){
	
	function GameLogic(){
		bcnewEntity.Entity.call(this, "GameLogic");
		this.dog = null;
	}
	
	GameLogic.prototype = new bcnewEntity.Entity();
	
	GameLogic.prototype.onInit = function() {
		this.dog = new bcnewGameObject.GameObject("dog");
		var imgAsset = bcnResourceMng.loadAsset("Images/zy_xyz.png");
		var sprite = new bcnewRender.Sprite(imgAsset, 0, 0, 0, 0);
		var renderer = new bcnewRender.Renderer();
		renderer.setSize(200,268);
		renderer.setSprite(sprite);
		this.dog.addComp(renderer);
	}
	
	GameLogic.prototype.onUpdate = function() {
		if (bcnInput.isMouseUp()){
			console.log("GameLogic  bcnInput.isMouseUp");
			this.dog.transform.position.x = this.dog.transform.position.x + 100;
		}
	}
	
	return {
		GameLogic : GameLogic
	}
	
});