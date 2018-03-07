/**
 * 
 */

require.config({
	baseUrl:"js",
});

require(["logic/gameLogic"], 
function (gameLogic){
	console.log("init");
	bcnewClient.init(500, 800);
	bcnewClient.startMainLoop();
	bcnServiceCenter.regService(new gameLogic.GameLogic());
});