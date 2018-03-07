/**
 * 
 */
define(["bcnew/bcnew"], 
function (bcnew){
	
	function GameLogic(){
		var colliderMng = new bcnewCollider.ColliderMng();
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
		var collider = new bcnewCollider.Collider();
		collider.setBound(0,0,200,268);
		this.dog.addComp(collider);
	}
	
	GameLogic.prototype.onUpdate = function() {
		if (bcnInput.isMouseUp()){
			var collider = bcnColliderMng.isInCollider(bcnewClient.inputPos2Game(bcnInput.getMousePos()));
			if (collider != null){
				console.log("collider:" + collider.gameobject.name);
				 collider.gameobject.transform.position.x =  collider.gameobject.transform.position.x + 100;		
			}
			console.log("GameLogic  bcnInput.isMouseUp");
			console.log(bcnInput.getMousePos());
		}
	}

	return {
		GameLogic : GameLogic
	}
	
});