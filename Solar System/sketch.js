const width = 900;
const height = 900;
const G = 6.67428e-11;  // The gravitational constant G
const AU = 149.6e9;  // 149.6 billion meters.
const fr = 144;

class Body {
	constructor(name, mass, r, v, size = 3, color = [255, 255, 255]) {
		this.name = name;
		this.mass = mass;

		var a = Math.floor(Math.random() * 360);

		this.x = r * Math.cos(a * (Math.PI / 180)) * AU;
		this.y = r * Math.sin(a * (Math.PI / 180)) * AU;

		this.vx = v * -Math.sin(a * (Math.PI / 180)) * 1000;
		this.vy = v * Math.cos(a * (Math.PI / 180)) * 1000;

		this.size = size;
		this.color = color;
	}

	attraction(other) {
		var dx = other.x - this.x;
		var dy = other.y - this.y;
		var d = (dx * dx + dy * dy) ** 0.5;

		if (d == 0) {
			return [0, 0];
		}

		var f = G * this.mass * other.mass / (d * d);

		var theta = Math.atan2(dy, dx);
		var fx = Math.cos(theta) * f;
		var fy = Math.sin(theta) * f;

		return [fx, fy];
	}

	display() {
		fill(this.color)
		ellipse((this.x * scale) + width / 2, (this.y * scale) + height / 2, this.size, this.size);
	}
}

function setup() {
	createCanvas(width, height);
	frameRate(fr);
	fill(255);
	strokeWeight(0.5);
	noStroke(150);

	day = 1;
	week = day * 7;
	year = day * 365.2425;
	month = year / 12;

	daysPerSecond = month;  // change this to one of time varibales above, larger time will have a faster but lower quality simulation
	timeMulti = daysPerSecond / fr;
	timestep = 86400 * timeMulti;

	sun = new Body("Sun", 1.98855e30, 0, 0, 5.5, [255, 150, 0]);
	mercury = new Body("Mercury", 3.3011e23, 0.4, 47, 3, [150, 150, 150]);
	venus = new Body("Venus", 4.8675e24, 0.72, 35, 3.5, [240, 194, 141]);
	earth = new Body("Earth", 5.97237e24, 1, 29.8, 4, [14, 177, 199]);
	mars = new Body("Mars", 6.4171e23, 1.5, 24.1, 3.5, [232, 116, 49]);
	jupiter = new Body("Jupiter", 1.8986e27, 5.25, 13.1, 5, [240, 194, 141]);
	saturn = new Body("Saturn", 5.6836e26, 9.5, 9.7, 4.5, [240, 179, 101]);
	uranus = new Body("Uranas", 8.6810e25, 19.21, 6.8, 4, [147, 228, 237]);
	neptune = new Body("Neptune", 8.6810e25, 30.11, 5.43, 4, [71, 182, 255]);

	bodies = [sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];

	focus = 0;
	days = 0;
	show_closest = false;

	iterations = 1;
	scale = (width * 0.9 / 2) / (32 * AU);

	stars = [];

	for (var i = 0; i < 1000; i++) {
		stars.push([
			Math.random() * width,
			Math.random() * height
		])
	}
}

function draw() {
	background(0);

	// draw stars

	for (var i = 0; i < stars.length; i++) {
		ellipse(stars[i][0], stars[i][1], 0.5, 0.5)
	}

	for (var i = 0; i < iterations; i++) {
		simuation(i);
		days += timeMulti / fr;
	}

	// draw line

	closest_planet = undefined;

	if (show_closest && focus != 0) {

		closest_distance = Infinity;

		for (var i = 1; i < 9; i++) {
			if (i != focus) {
				dif_x = bodies[focus].x - bodies[i].x;
				dif_y = bodies[focus].y - bodies[i].y;
				dist = Math.sqrt(dif_x * dif_x + dif_y * dif_y)

				if (dist < closest_distance) {
					closest_planet = bodies[i];
					closest_distance = dist;
				}
			}
		}
		
		stroke(255);
		line((bodies[focus].x * scale) + width / 2, (bodies[focus].y * scale) + height / 2, (closest_planet.x * scale) + width / 2, (closest_planet.y * scale) + height / 2)
		noStroke();
	}

	// text
	fill(255);
	textSize(15);
	textAlign(RIGHT, TOP);
	text('days: ' + Math.floor(days / 0.006944444444444444), width - 3, 3);
	text('focus: ' + bodies[focus].name, width - 3, 21);
	text('framerate: ' + Math.floor(frameRate()), width - 3, 39);
	text('iterations per frame: ' + iterations, width - 3, 57);
	if (closest_planet != undefined) {
		text('closest planet: ' + closest_planet.name, width - 3, 75);
	}
}

function simuation(n) {
	var force = [];

	for (var bodyIndex = 0; bodyIndex < bodies.length; bodyIndex++) {
		var body = bodies[bodyIndex];

		var totalFX = 0;
		var totalFY = 0;

		for (var otherIndex = 0; otherIndex < bodies.length; otherIndex++) {
			var other = bodies[otherIndex];
			if (other !== body) {
				var att = body.attraction(other);
				totalFX += att[0];
				totalFY += att[1];
			}
		}

		force.push([totalFX, totalFY]);
	}

	if (n == iterations - 1) {  // keeps focus at center of screen
		var offsetX = bodies[focus].x
		var offsetY = bodies[focus].y
	}

	for (var bodyIndex = 0; bodyIndex < bodies.length; bodyIndex++) {
		var body = bodies[bodyIndex];
		var f = force[bodyIndex];

		body.vx += f[0] / body.mass * timestep;
		body.vy += f[1] / body.mass * timestep;

		body.x += body.vx * timestep;
		body.y += body.vy * timestep;

		if (n == iterations - 1) {
			body.x -= offsetX;
			body.y -= offsetY;
			body.display();
		}
	}
}

function keyPressed() {
	if (keyCode == 189) {  // +
		scale *= 0.8
	}
	if (keyCode == 187) {  // -
		scale *= 1.2
	}

	if (keyCode == 188 && iterations > 1) {  // <
		iterations /= 2;
	}
	if (keyCode == 190) {  // >
		iterations *= 2;
	}

	if (keyCode == 219) {  // [
		focus = (9 + focus - 1) % 9;
	}
	if (keyCode == 221) {  // ]
		focus = (focus + 1) % 9;
	}

	if (keyCode == 67) {
		show_closest = !show_closest;
	}
}
