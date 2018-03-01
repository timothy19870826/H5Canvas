/**
 * 
 */

define(["bcnewClient"], function (bcnewClient){
		
	function init(x, y, width, height){
		window.client = new bcnewClient.Client();
		client.initCanvas(0,0,500,800);
	}
	
	function regService(service){
		client.regService(service);
	}
	
	function unregService(service){
		client.unregService(service);
	}
	
	function findService(name){
		return client.findServiceByName(name);
	}
	
	function startMainLoop(){
		client.mainLoopId = setInterval(function() {
			client.update();
		}, 40);
	}
	
	function stopMainLoop(){
		clearInterval(client.mainLoopId);
	}
	
	return {
		init : init,
		regService : regService,
		unregService : unregService,
		findService : findService,
		startMainLoop : startMainLoop,
		stopMainLoop : stopMainLoop
	}
});
