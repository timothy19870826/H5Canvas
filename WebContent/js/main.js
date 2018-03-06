/**
 * 
 */

require.config({
	baseUrl:"js",
});

require(["logic/gameLogic", "bcnew/bcnewClient"], 
function (gameLogic, bcnewClient){
	bcnewClient.init(0, 0, 500, 800);
	bcnewClient.startMainLoop();
	bcnServiceCenter.regService(new gameLogic.GameLogic());
});