/**
 * 
 */
define(["bcnew/bcnew"],
function(bcnew) {
		
	function createGO(config, parent) {
		var go = new bcnewGameObject.GameObject(config.name);
		if (parent != null){
			go.transform.setParent(parent.transform);
		}
		go.transform.setSize(config.size);
		var pos = new bcnewEntity.Vector2(config.pos.x, -config.pos.y);
		go.transform.setLocalPosition(pos);
		go.transform.setLocalDepth(config.depth);
		if (config.sprite != null && config.sprite != ""){
			var imgAsset = bcnResourceMng.loadAsset("Images/" + config.sprite + ".png");
			var sprite = new bcnewRender.Sprite(imgAsset, 0, 0, 0, 0);
			var renderer = go.createComp("Renderer");// new bcnewRender.Renderer();
			renderer.setSprite(sprite);
		}
		for (var idx = 0; idx < config.child.length; ++idx){
			var childGo = createGO(config.child[idx], go);
		}
		return go;
	}
	
	function createFrameAnimCfg(animCfg, spriteList){
		var list = new Array();
		var sprite;
		var spriteCfg;
		var spriteName;
		var frameCfg;
		var frameCfgArr = new Array();
		var imgAsset = bcnResourceMng.loadAsset(animCfg.img);
		if (animCfg.count == 1){
			spriteName = animCfg.spriteFmt;
			spritCfg = findSpriteCfg(spriteName, spriteList);
			sprite = new bcnewRender.Sprite(imgAsset, spritCfg.x, spritCfg.y, spritCfg.width, spritCfg.height);
			frameCfg = new bcnewAnimation.FrameCfg(sprite, animCfg.interval);
			frameCfgArr.push(frameCfg);
			return new bcnewAnimation.FrameAnimCfg(animCfg.duration, frameCfgArr);
		}
		for (var idx = 0; idx < animCfg.count; ++idx){
			spriteName = animCfg.spriteFmt + idx;
			spritCfg = findSpriteCfg(spriteName, spriteList);
			sprite = new bcnewRender.Sprite(imgAsset, spritCfg.x, spritCfg.y, spritCfg.width, spritCfg.height);
			frameCfg = new bcnewAnimation.FrameCfg(sprite, idx * animCfg.interval);
			frameCfgArr.push(frameCfg);
		}
		return new bcnewAnimation.FrameAnimCfg(animCfg.duration, frameCfgArr);
	}
	
	function findSpriteCfg(name, spriteList){
		for (var idx = 0; idx < spriteList.length; ++idx){
			if (spriteList[idx].name == name){
				return spriteList[idx];
			}
		}
		return {x:0,y:0,width:0,height:0};
	}
	
	return {
		createGO : createGO,
		createFrameAnimCfg : createFrameAnimCfg
	}
})
