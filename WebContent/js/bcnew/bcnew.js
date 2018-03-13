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
			"bcnew/bcnewInput",
			"bcnew/bcnewClient"
		],
		function (bcnewEntity,
				bcnewTransform,
				bcnewCollider,
				bcnewGameObject,
				bcnewResource,
				bcnewRender,
				bcnewAnimation,
				bcnewInput,
				bcnewClient){
			window.bcnewEntity = bcnewEntity;
			window.bcnewTransform = bcnewTransform;
			window.bcnewCollider = bcnewCollider;
			window.bcnewGameObject = bcnewGameObject;
			window.bcnewResource = bcnewResource;
			window.bcnewRender = bcnewRender;
			window.bcnewAnimation = bcnewAnimation;
			window.bcnewInput = bcnewInput;
			window.bcnewClient = bcnewClient;
		}
);
