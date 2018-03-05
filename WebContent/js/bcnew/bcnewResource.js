/**
 * 
 */
define("bcnewEntity", function (bcnewEntity){

	
	var ResAssetType = {};
	ResAssetType.None = 0;
	ResAssetType.Image = 1;
	ResAssetType.Audio = 2;
	ResAssetType.Max = 3;
	
	function ResAsset(assetType, src){
		this.assetType = assetType;
		this.src = src;
		this.ref = 1;
		if (this.assetType == ResAssetType.Image){
			this.image = new Image();
			this.image.src = src;
		}
		else if (this.assetType == ResAssetType.Audio){
			
		}
	}
	
	ResAsset.prototype.release = function() {
		
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
	
	ResourceMng.prototype.loadImage = function(src) {
		var asset = this.findAsset(src);
		if (asset != null){
			asset.ref++;
			return asset;
		}
		asset = new ResAsset(ResAssetType.Image, src);
		this.assetArr.push(asset);
		return asset;
	} 
	
	ResourceMng.prototype.clearUnuseAsset = function() {
		//
	}
})