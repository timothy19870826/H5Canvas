/**
 * 
 */
define(["bcnew/bcnew", "logic/logics"], 
function (bcnew, logics){
	
	function GameLogic(){
		bcnewEntity.Entity.call(this, "GameLogic");
		this.dog = null;
		this.dice = null;
		window.wldGameLogic = this;
	}
	
	GameLogic.prototype = new bcnewEntity.Entity();
	
	GameLogic.prototype.onInit = function() {
		this.dog = new bcnewGameObject.GameObject("dog");
		this.dog.transform.setSize(new bcnewEntity.Vector2(200, 268));
		var imgAsset = bcnResourceMng.loadAsset("Images/zy_xyz.png");
		var sprite = new bcnewRender.Sprite(imgAsset, 0, 0, 0, 0);
		var renderer = new bcnewRender.Renderer();
		renderer.setSprite(sprite);
		this.dog.addComp(renderer);
		this.dog.renderer = renderer;
		var collider = new bcnewCollider.Collider();
		collider.autoCollider = true;
		collider.onTouchEnd = function() {
			this.gameobject.transform.position.x = this.gameobject.transform.position.x + 100;
		}
		this.dog.addComp(collider);
		this.dog.collider = collider;
		
		var go = logicGoFactory.createGOByConfig(logicMainConfig);
		go.name = "main";
		this.dice = go.transform.findChild("dice");
		if (this.dice == null){
			console.log("nullllll");
		}
		else{
			var collider = new bcnewCollider.Collider();
			collider.autoCollider = true;
			collider.onTouchEnd = function() {
				var dog = wldGameLogic.dog;
				dog.transform.position.x = dog.transform.position.x + 100;
			}
			this.dice.gameobject.addComp(collider);
			this.dice.gameobject.collider = collider;
		}
	}
	
	GameLogic.prototype.onUpdate = function() {
	}

	return {
		GameLogic : GameLogic
	}
	
});