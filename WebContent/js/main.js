/**
 * 
 */

require.config({
	baseUrl:"js/bcnew",
});

require(["bcnewEntity", "bcnewResource", "bcnewRender", "bcnewClient"], function (bcnewEntity, bcnewResource, bcnewRender, bcnewClient){
	bcnewClient.init(0, 0, 500, 800);
	bcnewClient.startMainLoop();
	var bg = new bcnewEntity.GameObject();
	var imgAsset = bcnResourceMng.loadAsset("Images/zy_xyz.png");
	var sprite = new bcnewRender.Sprite(imgAsset, 0, 0, 0, 0);
	var renderer = new bcnewRender.Renderer();
	renderer.setSize(200,268);
	renderer.setSprite(sprite);
	bg.addComp(renderer);
});