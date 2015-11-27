Number.prototype.round = function(digits) {
	var digits = digits || 0;
	if(digits === 0){return Math.round(this);}
	return Math.round(this * Math.pow(10,digits)) / Math.pow(10,digits);
};

Number.prototype.pow = function(num) {
	return Math.pow(this, num);
};

Number.prototype.sq = function(){
	return Math.pow(this, 2);
}

Number.prototype.sqrt = function() {
	return Math.sqrt(this);
};


var G = 0.0000001;





Engine = archetype.extend({


	initialize : function(){
		var self = this;
		$(document).on('keydown', function(e){
			if(e.keyCode === 87) self.trigger('key:w');
			if(e.keyCode === 65) self.trigger('key:a');
			if(e.keyCode === 83) self.trigger('key:s');
			if(e.keyCode === 68) self.trigger('key:d');
			if(e.keyCode === 81) self.trigger('key:q');
			if(e.keyCode === 69) self.trigger('key:e');
		});



		this.sprites = [];





		var canvas = document.getElementById('canvas');
		var ctx = canvas.getContext('2d');


		console.log(canvas.width, canvas.height);

		ctx.translate(canvas.width/2, canvas.height/2);


		//draw center
		ctx.beginPath();
		ctx.arc(0,0,50,0,2*Math.PI);
		ctx.strokeStyle="red";
		ctx.stroke();





		window.requestAnimFrame = (function(callback) {
				return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
				function(callback) {
				  window.setTimeout(callback, 1000 / 60);
				};
			  })();

		var animate = function() {


			// update

			// clear
			ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);


			//ctx.translate(canvas.width/2, canvas.height/2);
			//ctx.translate(20,20);


			_.each(self.sprites, function(sprite){
				//ctx.save();

				//sprite.applyDrag(0.995);
				sprite.draw(ctx, canvas);




				//console.log(sprite);
				//$('#output').text(sprite.state.angle.round(2));
				//ctx.restore();
			})






			//ctx.translate(-20,-20);


			if(self.sprites[0] && self.sprites[1]){
				//self.checkCollision(self.sprites[0], self.sprites[1]);
				//self.calcGravity(self.sprites[1], self.sprites[0]);
			}


			self.drawCrossHairs(ctx, canvas)

			// request new frame
			requestAnimFrame(function() {
				animate();
			});
		}
		animate();









		return this;
	},


	add : function(sprite){

		this.sprites.push(sprite)
		return this;
	},


	drawCrossHairs : function(ctx, canvas){
		ctx.beginPath();
		ctx.moveTo(0,canvas.height/2);
		ctx.lineTo(0,-canvas.height/2);
		ctx.moveTo(canvas.width/2, 0);
		ctx.lineTo(-canvas.width/2, 0);
		ctx.strokeStyle="white";
		ctx.lineWidth=1;
		ctx.stroke();
		return this;
	},

	checkCollision : function(obj1, obj2){
		var distsq = (obj1.x-obj2.x).sq() + (obj1.y-obj2.y).sq();
		if(distsq > (obj1.boundary.radius + obj2.boundary.radius).sq()) return;

		console.log('boundary radius Collision!');

		obj1.trigger('collision', obj2);
		obj2.trigger('collision', obj1);


		return this;
	},


	calcGravity : function(obj1, obj2){
		var dx = obj2.x-obj1.x;
		var dy = obj2.y-obj1.y;
		var distsq = dx.sq() + dy.sq();

		var force = G*obj1.mass*obj2.mass/distsq;
		var ang = (Math.atan(dy/dx)) + (dy < 0 ? 0.5 : 0);

		$('#output').text(force + " - " + ang.round(3));

		//obj1.applyForce(force, ang);

		return this;
	},








})


util = util || {};

util.dist = function(p1, p2){
	return p1
}