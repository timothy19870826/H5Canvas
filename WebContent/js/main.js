/**
 * 
 */

require.config({
	baseUrl:"js/bcnew",
});

require(["bcnew"], function (bcnew){
	bcnew.init(0, 0, 500, 800);
	bcnew.startMainLoop();
});