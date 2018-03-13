/**
 * 
 */
define(["bcnew/bcnew", "logic/logics"], 
function (bcnew, logics){
	
	function GameLogic(){
		bcnewEntity.Entity.call(this, "GameLogic");
		this.dog = null;
		this.dice = null;
		window.wldGameLogic = this;
	}
	
	GameLogic.prototype = new bcnewEntity.Entity();
	
	GameLogic.prototype.onInit = function() {
		this.dog = new bcnewGameObject.GameObject("dog");
		this.dog.transform.setSize(new bcnewEntity.Vector2(200, 268));
		var imgAsset = bcnResourceMng.loadAsset("Images/zy_xyz.png");
		var sprite = new bcnewRender.Sprite(imgAsset, 0, 0, 0, 0);
		var renderer = new bcnewRender.Renderer();
		renderer.setSprite(sprite);
		this.dog.addComp(renderer);
		this.dog.renderer = renderer;
		var collider = new bcnewCollider.Collider();
		collider.autoCollider = true;
		collider.onTouchEnd = function() {
			this.gameobject.transform.position.x = this.gameobject.transform.position.x + 100;
		}
		this.dog.addComp(collider);
		this.dog.collider = collider;
		this.curIdx = 0;
		var go = logicGoFactory.createGOByConfig(logicMainConfig.mainLayout);
		go.name = "main";
		this.smallDog = go.transform.findChild("dog");
		if (this.smallDog != null){
			var animation = new bcnewAnimation.Animation();
			this.smallDog.gameobject.addComp(animation);
			this.smallDog.gameobject.animation = animation;
		}
		else{
			console.log("smallDog nullllll");
		}
		this.path = go.transform.findChild("path");
		if (this.path != null){
			this.path.getTrack = function(startIdx, step) {
				var track = new Array();
				var child = null;
				var pos;
				var size = wldGameLogic.smallDog.getSize();
				for (var idx = 1; idx <= step; ++idx){
					console.log((startIdx + idx) % this.getChildCount());
					child = this.getChildByIdx((startIdx + idx) % this.getChildCount());
					console.log(child);
					pos = child.getPosition();
					if (child != null){
						track.push(new bcnewEntity.Vector2(pos.x, pos.y - size.y / 2));
					}
				}
				return track;
			}
		}
		else{
			console.log("path nullllll");
		}
		this.dice = go.transform.findChild("dice");
		if (this.dice == null){
			console.log("dice nullllll");
		}
		else{
			var animation = new bcnewAnimation.Animation();
			this.dice.gameobject.addComp(animation);
			this.dice.gameobject.animation = animation;
			// collider
			var collider = new bcnewCollider.Collider();
			collider.autoCollider = true;
			collider.onTouchEnd = function() {
				if (this.disable == true){
					return;
				}
				wldGameLogic.count = getRandomInt(1, 7);
				console.log(wldGameLogic.count);
				var frameAnimCfg = logicGoFactory.createFrameAnimCfg(logicMainConfig.diceAnim, logicMainConfig.spriteCfg);
				frameAnimCfg.duration = 2000;
				var action = new bcnewAnimation.FrameAnimAction(frameAnimCfg);
				frameAnimCfg = logicGoFactory.createFrameAnimCfg(getDiceState(wldGameLogic.count), logicMainConfig.spriteCfg);
				frameAnimCfg.duration = 1;
				var nextAction = new bcnewAnimation.FrameAnimAction(frameAnimCfg);
				nextAction.onCompletedArg = wldGameLogic.smallDog;
				nextAction.onCompleted = function(args){
					console.log(logicMainConfig.dogAnim);
					var dogAnimCfg = logicGoFactory.createFrameAnimCfg(logicMainConfig.dogAnim, logicMainConfig.spriteCfg);
					var dogAnim = new bcnewAnimation.FrameAnimAction(dogAnimCfg);
					var moveCfg = new bcnewAnimation.MoveCfg(new Array(), 100, false);
					moveCfg.track = wldGameLogic.path.getTrack(wldGameLogic.curIdx, wldGameLogic.count);
					wldGameLogic.curIdx += wldGameLogic.count;
					console.log(moveCfg.track);
					var moveAction = new bcnewAnimation.MoveAction(moveCfg);
					moveAction.addChild(dogAnim);
					args.gameobject.animation.addAction(moveAction);
					//args.transform.position.x = args.transform.position.x + 100;
					this.onCompleted = null;
				}
				action.setNext(nextAction);
				this.gameobject.animation.addAction(action);
				this.disable = true;
				this.onTimeOut = function(){
					wldGameLogic.dice.gameobject.collider.disable = false;
				}
				setTimeout(this.onTimeOut, 2000);
			}
			this.dice.gameobject.addComp(collider);
			this.dice.gameobject.collider = collider;
		}
	}
	
	GameLogic.prototype.onUpdate = function() {
	}
	
	function getRandomInt(min, max) {
		  return min + Math.floor(Math.random() * Math.floor(max));
		}
	
	function getDiceState(diceCount){
		switch (diceCount) {
		case 1:
			return logicMainConfig.dice1;
		case 2:
			return logicMainConfig.dice2;
		case 3:
			return logicMainConfig.dice3;
		case 4:
			return logicMainConfig.dice4;
		case 5:
			return logicMainConfig.dice5;
		case 6:
			return logicMainConfig.dice6;

		default:
			return logicMainConfig.dice1;
		}
	}

	return {
		GameLogic : GameLogic
	}
	
});