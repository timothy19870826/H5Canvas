/**
 * 
 */
define(["bcnew/bcnew"],
function(bcnew) {
	
	function createGOByConfig(config) {
		var go = new bcnewGameObject.GameObject(config.name);
		go.transform.setLocalPosition(new bcnewEntity.Vector2(-360, -568));
		for (var idx = 0; idx < config.child.length; ++idx){
			var childGo = createGO(config.child[idx], go);
		}
		//go.transform.forceUpdate();
		//go.transform.freshChild();
		return go;
	}
	
	function createGO(config, parent) {
		var go = new bcnewGameObject.GameObject(config.name);
		go.transform.setParent(parent.transform);
		go.transform.setSize(config.size);
		var pos = new bcnewEntity.Vector2(config.pos.x, -config.pos.y);
		console.log(pos);
		go.transform.setLocalPosition(pos);
		go.transform.setLocalDepth(config.depth);
		if (config.sprite != null && config.sprite != ""){
			var imgAsset = bcnResourceMng.loadAsset("Images/" + config.sprite + ".png");
			var sprite = new bcnewRender.Sprite(imgAsset, 0, 0, 0, 0);
			var renderer = new bcnewRender.Renderer();
			renderer.setSprite(sprite);
			go.addComp(renderer);
			go.renderer = renderer;
		}
		for (var idx = 0; idx < config.child.length; ++idx){
			var childGo = createGO(config.child[idx], go);
		}
		return go;
	}
	
	return {
		createGOByConfig : createGOByConfig
	}
})
