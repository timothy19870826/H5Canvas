/**
 * 
 */
define(["bcnew/bcnewEntity"], function(bcnewEntity) {
	
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
	
	ResourceMng.prototype.findAsset = function(assetId) {
		for (var idx = 0; idx < this.assetArr.length; ++idx) {
			if (this.assetArr[idx].assetId == assetId){
				return this.assetArr[idx];
			}
		}
		return null;
	}
	
	ResourceMng.prototype.loadAsset = function(assetId) {
		var asset = this.findAsset(assetId);
		if (asset != null){
			asset.assetRef++;
			return asset;
		}
		var image = new Image();
		image.onload = function() {
			this.assetReady = true;
		};
		image.src = assetId;
		image.assetId = assetId;
		image.assetRef = 1;
		this.assetArr.push(image);
		return image;
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
		ResourceMng : ResourceMng
	}
})