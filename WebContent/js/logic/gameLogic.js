/**
 * 
 */
define(["bcnew/bcnew"], 
function (bcnew){
	
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
		renderer.setSprite(sprite);
		this.dog.addComp(renderer);
		this.dog.render = renderer;
		var collider = new bcnewCollider.Collider();
		collider.autoRender = true;
		collider.onTouchEnd = function() {
			this.gameobject.transform.position.x = this.gameobject.transform.position.x + 100;
		}
		this.dog.addComp(collider);
		this.dog.collider = collider;
	}
	
	GameLogic.prototype.onUpdate = function() {
		/*
		if (bcnInput.isMouseUp()){
			var touchPos = bcnewClient.inputPos2Game(bcnInput.getMousePos());
			if (this.dog.collider.isContainPoint(touchPos)){
				this.dog.transform.position.x = this.dog.transform.position.x + 100;
			}
		}*/
	}

	return {
		GameLogic : GameLogic
	}
	
});