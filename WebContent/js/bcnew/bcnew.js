/**
 * 
 */

define(
		[
			"bcnew/bcnewEntity", 
			"bcnew/bcnewTransform", 
			"bcnew/bcnewCollider",
			"bcnew/bcnewGameObject", 
			"bcnew/bcnewResource", 
			"bcnew/bcnewRender", 
			"bcnew/bcnewAnimation",
			"bcnew/bcnewTimer",
			"bcnew/bcnewInput",
			"bcnew/bcnewEventCenter",
		],
		function (bcnewEntity,
				bcnewTransform,
				bcnewCollider,
				bcnewGameObject,
				bcnewResource,
				bcnewRender,
				bcnewAnimation,
				bcnewTimer,
				bcnewInput,
				bcnewEventCenter){
			window.bcnewEntity = bcnewEntity;
			window.bcnewTransform = bcnewTransform;
			window.bcnewCollider = bcnewCollider;
			window.bcnewGameObject = bcnewGameObject;
			window.bcnewResource = bcnewResource;
			window.bcnewRender = bcnewRender;
			window.bcnewAnimation = bcnewAnimation;
			window.bcnewTimer = bcnewTimer;
			window.bcnewInput = bcnewInput;
			window.bcnewEventCenter = bcnewEventCenter;
		}
);
