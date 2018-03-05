/**
 * 
 */

require.config({
	baseUrl:"js/bcnew",
});

require(["bcnewEntity", "bcnewRender", "bcnewClient"], function (bcnewEntity, bcnewRender, bcnewClient){
	bcnewClient.init(0, 0, 500, 800);
	bcnewClient.startMainLoop();
	var bg = new bcnewEntity.GameObject();
	var image = new Image();
	image.src = "Images/zy_xyz.png";
	var sprite = new bcnewEntity.Sprite(image, 0, 0, image.width, image.height);
	var renderer = new bcnewRender.Renderer();
	renderer.setSize(200,200);
	renderer.setSprite(sprite);
	bg.addComp(renderer);
});