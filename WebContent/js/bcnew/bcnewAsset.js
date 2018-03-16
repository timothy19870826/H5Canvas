/**
 * 
 */
define(function() {
		
	function AssetManager() {
		this.assetList = new Array();
	}
	
	AssetManager.prototype.regAsset = function(assetId, assetObj) {
		for (var idx = 0; idx < this.assetList.length; ++idx){
			if (this.assetList[idx].assetId == assetId){
				return;
			}
		}
		assetObj.assetId = assetId;
		this.assetList.push(assetObj);
		return assetObj;
	}
	
	AssetManager.prototype.loadAsset = function(assetId) {
		var asset = this.findAsset(assetId);
		if (asset != null){
			if (asset.ref != null){
				asset.ref++;
			}
			return asset;
		}
		//assetId = "ma.png"; 
		var asset = assetId.slice(assetId.lastIndexOf(".")) == ".png" ? loadImage(assetId) : loadJson(assetId);
		asset = this.regAsset(assetId, asset);
		asset.assetRef = 1;
		console.log(asset);
		return asset;
	}
	
	AssetManager.prototype.unloadAsset = function(assetId) {
		var asset = this.findAsset(assetId);
		if (asset != null){
			if (asset.assetRef != null){
				asset.assetRef--;
				if (asset.assetRef == 0){
					this.unregAsset(assetId);
				}
			}
		}
	}
	
	function loadImage(url){
		var image = new Image();
		image.onload = function() {
			this.assetReady = true;
		};
		image.src = url;
		return image;
	}
	
	function loadJson(url) {
		return {assetReady:true};
	}
	
	AssetManager.prototype.findAsset = function(assetId) {
		for (var idx = 0; idx < this.assetList.length; ++idx){
			if (this.assetList[idx].assetId == assetId){
				return this.assetList[idx];
			}
		}
		return null;
	}
	
	AssetManager.prototype.unregAsset = function(assetId) {
		for (var idx = 0; idx < this.assetList.length; ++idx){
			if (this.assetList[idx].assetId == assetId){
				return this.assetList.splice(idx, 1);
			}
		}
	}
	
	AssetManager.prototype.clearUnuseAsset = function() {
		for (var idx = 0; idx < this.assetList.length; ++idx){
			if (this.assetList[idx].assetRef != null && this.assetList[idx].assetRef <= 0){
				return this.assetList.splice(idx, 1);
			}
		}
	}
	
	function regAsset(assetId, assetRes) {
		if (window.bcnAssetMng == null){
			window.bcnAssetMng = new AssetManager();
			console.log("Images/main.png".slice("Images/main.png".lastIndexOf('.')));
		}
		window.bcnAssetMng.regAsset(assetId, assetRes);
	}
	
	function loadAsset(assetId) {
		if (window.bcnAssetMng == null){
			window.bcnAssetMng = new AssetManager();
		}
		return window.bcnAssetMng.loadAsset(assetId);
	} 
	
	function findAsset(assetId) {
		if (window.bcnAssetMng == null){
			return null;
		}
		return window.bcnAssetMng.findAsset(assetId);
	}
	
	function unregAsset(assetId) {
		if (window.bcnAssetMng == null){
			return ;
		}
		window.bcnAssetMng.unregAsset(assetId);
	}
	
	function clearUnuseAsset() {
		//
		if (window.bcnAssetMng == null){
			return ;
		}
		window.bcnAssetMng.clearUnuseAsset();
		for (var idx = this.assetArr.length - 1; idx >= 0; idx--){
			if (this.assetArr[idx].assetRef != null && this.assetArr[idx].assetRef <= 0){
				this.assetArr.splice(idx, 1);
			}
		}
	}
	
	function createGO(config, parent) {
		var go = new bcnewGameObject.GameObject(config.name);
		if (parent != null){
			go.transform.setParent(parent.transform);
		}
		go.transform.setSize(config.transformCfg.localSize);
		go.transform.setLocalPosition(config.transformCfg.localPos);
		go.transform.setLocalScale(config.transformCfg.localScale);
		go.transform.setLocalDepth(config.transformCfg.depth);
		// init renderer
		if (config.rendererCfg != null && 
			config.rendererCfg.image != null && 
			config.rendererCfg.image != ""){
			var renderer = go.addCompByName("Renderer");
			var imgAsset = loadAsset("Images/" + config.rendererCfg.image + ".png");
			var spriteCfg = findSprite(config.rendererCfg.image, config.rendererCfg.sprite);
			var sprite = new bcnewRender.Sprite(imgAsset, spriteCfg.x, spriteCfg.y, spriteCfg.width, spriteCfg.height);
			renderer.setSprite(sprite);
		}
		// init collider
		if (config.colliderCfg != null &&
			config.colliderCfg.width > 0 && 
			config.colliderCfg.height > 0){
			var collider = go.addCompByName("Collider");
			collider.setOffset(config.colliderCfg.offset);
			collider.setBound(config.colliderCfg.bound.x, 
					config.colliderCfg.bound.y, 
					config.colliderCfg.bound.width, 
					config.colliderCfg.bound.height);
		}
		// init children
		for (var idx = 0; idx < config.children.length; ++idx){
			var childGo = createGO(config.children[idx], go);
		}
		
		return go;
	}
		
	function createFrameAnimCfg(animCfg){
		var list = new Array();
		var sprite;
		var spriteCfg;
		var spriteName;
		var frameCfg;
		var frameCfgArr = new Array();
		var imgAsset = loadAsset(animCfg.img);
		if (animCfg.count == 1){
			spriteName = animCfg.spriteFmt;
			spriteCfg = findSprite(animCfg.img, spriteName);
			sprite = new bcnewRender.Sprite(imgAsset, spriteCfg.x, spriteCfg.y, spriteCfg.width, spriteCfg.height);
			frameCfg = new bcnewAnimation.FrameCfg(sprite, animCfg.interval);
			frameCfgArr.push(frameCfg);
			return new bcnewAnimation.FrameAnimCfg(animCfg.duration, frameCfgArr);
		}
		for (var idx = 0; idx < animCfg.count; ++idx){
			spriteName = animCfg.spriteFmt + idx;
			spriteCfg = findSprite(animCfg.img, spriteName);
			sprite = new bcnewRender.Sprite(imgAsset, spriteCfg.x, spriteCfg.y, spriteCfg.width, spriteCfg.height);
			frameCfg = new bcnewAnimation.FrameCfg(sprite, idx * animCfg.interval);
			frameCfgArr.push(frameCfg);
		}
		return new bcnewAnimation.FrameAnimCfg(animCfg.duration, frameCfgArr);
	}
	
	function findSprite(atlsName, spriteName){
		var atlasCfg = findAsset(atlsName);
		if (atlasCfg == null){
			return {x:0,y:0,width:0,height:0};
		}
		for (var idx = 0; idx < atlasCfg.length; ++idx){
			if (atlasCfg[idx].name == spriteName){
				return atlasCfg[idx];
			}
		}
		return {x:0,y:0,width:0,height:0};
	}
	
	return {
		createGO : createGO,
		regAsset : regAsset,
		loadAsset : loadAsset,
		findAsset : findAsset,
		unregAsset : unregAsset,
		clearUnuseAsset : clearUnuseAsset,
	}
})