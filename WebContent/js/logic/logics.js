/**
 * 
 */
define(
		[
			"logic/goFactory", 
			"logic/mainConfig", 
		],
		function (goFactory,
				mainConfig){
			window.logicGoFactory = goFactory;
			window.logicMainConfig = mainConfig;
		}
);