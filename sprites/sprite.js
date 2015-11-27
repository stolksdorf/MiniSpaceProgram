pi2 = Math.PI *2;

util = {};
util.extend = function(){
		var result = arguments[0];
		for(var i in arguments){
			var obj = arguments[i];
			for(var propName in obj){
				if(obj.hasOwnProperty(propName)){ result[propName] = obj[propName]; }
			}
		}
		return result;
	}

Sprite = archetype.extend({

	defaults : function(){

		this.isMovable = true;
		this.hasCollision = true;
		this.hasGravity = false;
		this.x = 0;
		this.y = 0;
		this.angle = 0;
		this.mass = 1;
		this.type = 'rectangle', //"circle;
		this.force = {
			amount : 0,
			angle : 0,
			rotation : 0,
		},
		this.boundary = {};
	},


	initialize : function(opts){
		var self = this;
		this.defaults();

		util.extend(this, opts);
		console.log(this);

		if(this.imagePath) this.setImage(this.imagePath);

		return this;
	},

	draw : function(ctx, canvas){

		this.x += this.force.amount * Math.sin(this.force.angle * pi2);
		this.y -= this.force.amount * Math.cos(this.force.angle * pi2);

		this.angle += this.force.rotation;




		if(this.image){
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(this.angle * pi2);
			ctx.drawImage(this.image,
				-this.image.width/2, -this.image.height/2
			)
			ctx.restore();
		}


		this.drawBoundry(ctx, canvas);

	},

	calculateBoundaries : function(){
		var self = this;
		var rotatePoint = function(deltaX,deltaY){
			var cos = Math.cos(self.angle*pi2),
				sin = Math.sin(self.angle*pi2),
				dx = deltaX * self.boundary.width/2 + self.x,
				dy = deltaY * self.boundary.height/2 + self.y;
			return {
				x : cos*(dx-self.x) - sin*(dy-self.y) + self.x,
				y : sin*(dx-self.x) + cos*(dy-self.y) + self.y
			}
		};
		this.boundary.ur = rotatePoint(1,-1);
		this.boundary.ul = rotatePoint(-1,-1);
		this.boundary.br = rotatePoint(1,1);
		this.boundary.bl = rotatePoint(-1,1);
		return this;
	},

	drawBoundry : function(ctx, canvas){

		ctx.beginPath();
		ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'green';
		ctx.fill();
		ctx.stroke();


		if(this.type === 'rectangle'){

			this.calculateBoundaries();
			ctx.beginPath();
			ctx.moveTo(this.boundary.ul.x, this.boundary.ul.y);
			ctx.lineTo(this.boundary.ur.x, this.boundary.ur.y);
			ctx.lineTo(this.boundary.br.x, this.boundary.br.y);
			ctx.lineTo(this.boundary.bl.x, this.boundary.bl.y);
			ctx.lineTo(this.boundary.ul.x, this.boundary.ul.y);
			ctx.strokeStyle = 'red';
			ctx.stroke();

			//Top left
			ctx.beginPath();
			ctx.arc(this.boundary.ul.x, this.boundary.ul.y, 2, 0, 2 * Math.PI, false);
			ctx.fillStyle = 'green';
			ctx.fill();
			ctx.stroke();
		}

		//Bounding Circle
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.boundary.radius, 0, 2 * Math.PI, false);
		ctx.strokeStyle = 'blue';
		ctx.stroke();

	},

	applyForce : function(amount, angle){
		rx = this.force.amount * Math.sin(this.force.angle * pi2) + amount * Math.sin(angle * pi2);
		ry = this.force.amount * Math.cos(this.force.angle * pi2) + amount * Math.cos(angle * pi2);
		this.force.amount = (rx.sq() + ry.sq()).sqrt();
		this.force.angle = (Math.atan(rx/ry) )/pi2 + (ry < 0 ? 0.5 : 0)
		return this;
	},z

	applySpin : function(amount){
		this.force.rotation += amount;
		return this;
	},

	applyDrag : function(dragAmount){
		this.force.amount *= dragAmount;
		this.force.rotation *= dragAmount;
		return this;
	},


	setImage : function(url){
		var self = this;
		this.image = new Image();
		this.image.src = url;

		this.image.onload = function(){
			self.boundary.width = self.boundary.width || self.image.width;
			self.boundary.height = self.boundary.height || self.image.height;

			self.boundary.radius = self.boundary.radius || (self.boundary.width.sq() + self.boundary.height.sq()).sqrt()/2;
		}

		return this;
	},



})