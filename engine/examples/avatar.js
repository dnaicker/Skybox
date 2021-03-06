SB.Examples.Avatar = function(param)
{
	SB.Entity.call(this, param);
	
	this.transform = new SB.Transform();
	
    var avParams = {};
    avParams.radiusTop    = 1;
    avParams.radiusBottom = 1;
    avParams.height       = 1.667;
    avParams.color = 0x0000ff;
//    avParams.ambient = 0x0000ff;

	this.visual = new SB.CylinderVisual(avParams);
	this.visual.position.y = 0.834;

	this.screenTracker = new SB.ScreenTracker( { referencePosition : new THREE.Vector3(0, 2, 0) });
	
	this.addComponent(this.transform);
	this.addComponent(this.visual);	
	this.addComponent(this.screenTracker);	

	this.screenTracker.subscribe("position", this, this.onScreenPositionChanged);

	this.annotation = new SB.Annotation( { style : "text300" } );
	this.annotation.setHTML("Skybox @Skybox5");
	this.annotation.show();
}

goog.inherits(SB.Examples.Avatar, SB.Entity);

SB.Examples.Avatar.prototype.realize = function() 
{
	SB.Entity.prototype.realize.call(this);
	this.screenTracker.start();
}

SB.Examples.Avatar.prototype.onScreenPositionChanged = function(pos)
{
	this.annotation.setPosition(pos);
}
