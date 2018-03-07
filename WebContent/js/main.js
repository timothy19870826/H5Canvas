/**
 * 
 */

require.config({
	baseUrl:"js",
});

require(["logic/gameLogic"], 
function (gameLogic){
	console.log("init");
	bcnewClient.init(0, 0, 500, 800);
	bcnewClient.startMainLoop();
	bcnServiceCenter.regService(new gameLogic.GameLogic());
});