/**
 * 
 */

require.config({
	baseUrl:"js",
});

require(["logic/gameLogic", "bcnew/bcnew"], 
function (gameLogic, bcnew){
	console.log("init");
	bcnewClient.init(100, 0, 500, 800);
	bcnewClient.startMainLoop();
	bcnServiceCenter.regService(new gameLogic.GameLogic());
});