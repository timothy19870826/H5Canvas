/**
 * 
 */

require.config({
	baseUrl:"js",
});

require(["logic/gameLogic"], 
function (gameLogic){
	console.log("init");
	bcnewClient.init(720, 1136);
	bcnewClient.startMainLoop();
	bcnServiceCenter.regService(new gameLogic.GameLogic());
});