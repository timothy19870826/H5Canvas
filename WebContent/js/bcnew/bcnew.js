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
			"bcnew/bcnewInput",
			"bcnew/bcnewClient"
		],
		function (bcnewEntity,
				bcnewTransform,
				bcnewCollider,
				bcnewGameObject,
				bcnewResource,
				bcnewRender,
				bcnewInput,
				bcnewClient){
			window.bcnewEntity = bcnewEntity;
			window.bcnewTransform = bcnewTransform;
			window.bcnewCollider = bcnewCollider;
			window.bcnewGameObject = bcnewGameObject;
			window.bcnewResource = bcnewResource;
			window.bcnewRender = bcnewRender;
			window.bcnewInput = bcnewInput;
			window.bcnewClient = bcnewClient;
		}
);
