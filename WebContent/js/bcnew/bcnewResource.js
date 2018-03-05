/**
 * 
 */
define(["bcnewEntity"], function(bcnewEntity) {

	var AssetType = {};
	AssetType.none = 0;
	AssetType.image = 1;
	AssetType.audio = 2;
	
	function ResAsset(assetType){
		this.assetType = assetType;
		this.ref = 1;
	}
	
	ResAsset.prototype.release = function() {
		this.ref--;
		if (this.ref <= 0 && bcnResourceMng != null){
			bcnResourceMng.clearAsset(this);
		}
	}

	function ImageAsset(src){
		ResAsset.call(this, AssetType.image);
		this.assetType = AssetType.image;
		this.src = src;
		this.ref = 1;
		this.image = new Image();
		this.image.onload = function() {
			this.ready = true;
		};
		this.image.src = src;
	}
	
	ImageAsset.prototype = new ResAsset();
	
	ImageAsset.prototype.isReady = function() {
		return this.image.ready;
	}
	
	function ResourceMng(){
		bcnewEntity.Entity.call(this, "ResourceMng");
		this.typeName = "ResourceMng";
		this.assetArr = new Array();

		if (window.bcnResourceMng != null){
			throw "ResourceMng registed";
		}
		else{
			window.bcnResourceMng = this;
		}
	}
	
	ResourceMng.prototype = new bcnewEntity.Entity();
	
	ResourceMng.prototype.findAsset = function(src) {
		for ( var asset in this.assetArr) {
			if (asset.src == src){
				return asset;
			}
		}
		return null;
	}
	
	ResourceMng.prototype.loadAsset = function(src) {
		var asset = this.findAsset(src);
		if (asset != null){
			asset.ref++;
			return asset;
		}
		asset = new ImageAsset(src);
		this.assetArr.push(asset);
		return asset;
	} 
	
	ResourceMng.prototype.clearAsset = function(asset) {
		//
		var idx = this.assetArr.indexOf(asset);
		if (idx >= 0){
			this.assetArr.splice(idx, 1);
		}
	}
	
	ResourceMng.prototype.clearUnuseAsset = function() {
		//
		for (var idx = this.assetArr.length - 1; idx >= 0; idx--){
			if (this.assetArr[idx].ref <= 0){
				this.assetArr.splice(idx, 1);
			}
		}
	}
	
	return {
		ResAsset : ResAsset,
		ImageAsset : ImageAsset,
		ResourceMng : ResourceMng
	}
})