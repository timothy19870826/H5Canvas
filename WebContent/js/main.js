/**
 * 
 */

require.config({
	baseUrl:"js",
});

require(["bcnew/bcnewClient","logic/gameLogic"], 
function (bcnewClient, gameLogic){
	console.log("init");
	bcnewClient.init(720, 1136);
	bcnewClient.startMainLoop();
	bcnServiceCenter.regService(new gameLogic.GameLogic());
});