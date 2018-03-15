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
		this.curIdx = 0;
		
		this.dog = new bcnewGameObject.GameObject("dog");
		this.dog.transform.setSize(new bcnewEntity.Vector2(200, 268));
				
		var renderer = this.dog.createComp("Renderer");
		var imgAsset = bcnResourceMng.loadAsset("Images/zy_xyz.png");
		var sprite = new bcnewRender.Sprite(imgAsset, 0, 0, 0, 0);
		renderer.setSprite(sprite);
		
		var collider = this.dog.createComp("Collider");
		collider.autoCollider = true;
		collider.onTouchEnd.addListener(function(arg) {
			arg.transform.position.x = arg.transform.position.x + 100;
		}, this.dog); 
				
		var go = logicGoFactory.createGOByConfig(logicMainConfig.mainLayout);
		go.name = "main";
		
		this.smallDog = go.transform.findChild("dog");
		if (this.smallDog != null){
			this.smallDog.gameobject.createComp("Animation");
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
					child = this.getChildByIdx((startIdx + idx) % this.getChildCount());
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
			var animation = this.dice.gameobject.createComp("Animation");
			// collider
			var collider = this.dice.gameobject.createComp("Collider");
			collider.autoCollider = true;
			collider.onTouchEnd.addListener(onClickDice, this.dice.gameobject);
		}
	}
	
	GameLogic.prototype.onUpdate = function() {
	}
	
	function onClickDice(dice, touchPos){
		if (dice.collider.disable == true){
			console.log("disable, click");
			return;
		}
		wldGameLogic.count = getRandomInt(1, 7);
		var frameAnimCfg = logicGoFactory.createFrameAnimCfg(logicMainConfig.diceAnim, logicMainConfig.spriteCfg);
		frameAnimCfg.duration = 2000;
		var action = new bcnewAnimation.FrameAnimAction(frameAnimCfg);
		frameAnimCfg = logicGoFactory.createFrameAnimCfg(getDiceState(wldGameLogic.count), logicMainConfig.spriteCfg);
		frameAnimCfg.duration = 1;
		var nextAction = new bcnewAnimation.FrameAnimAction(frameAnimCfg);
		nextAction.onCompleted.addListener(onDiceAnimCompleted, wldGameLogic.smallDog);
		action.setNext(nextAction);
		dice.animation.addAction(action);
		dice.collider.disable = true;
		
		bcnTimer.addTimer(function(arg) {
			arg.collider.disable = false;
			console.log("lalalal, hahahaha");
		},
		dice, 2000, 1);
	}
	
	function onDiceAnimCompleted(dog, sender){
		var dogAnimCfg = logicGoFactory.createFrameAnimCfg(logicMainConfig.dogAnim, logicMainConfig.spriteCfg);
		var dogAnim = new bcnewAnimation.FrameAnimAction(dogAnimCfg);
		var moveCfg = new bcnewAnimation.MoveCfg(new Array(), 100, false);
		moveCfg.track = wldGameLogic.path.getTrack(wldGameLogic.curIdx, wldGameLogic.count);
		wldGameLogic.curIdx += wldGameLogic.count;
		var moveAction = new bcnewAnimation.MoveAction(moveCfg);
		moveAction.addChild(dogAnim);
		dog.gameobject.animation.addAction(moveAction);
		sender.onCompleted.clear();
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