const width = 50;
const height = 50;
const scale = 15;

const neighbors = [-width, 1, width, -1];
const neighbors8 = [-width, -width + 1, 1, width + 1, width, width - 1, -1, -width - 1];

var highscore = 1481;
highscore = 0;

class Snake {
	constructor() {
		this.head = [Math.floor(width / 2), Math.floor(height / 2)];
		this.body = [];

		this.path = [];  // [apple, ..., near]
	}

	move() {
		// if path is empty, find one to the apple
		if (this.path.length == 0) {
			this.path = this.getNewPath();
		}

		// if apple was not found, or apple was found but we cant see tail if it is followed, follow the tail
		if (!this.path || !this.tailSight()) {
			this.path = this.followTail();
		}

		// extend body by adding head
		this.body.push([...this.head]);

		try {
			// head is next bit of the path
			this.head = [...this.path[this.path.length - 1]];
		}
		catch (error) {
			console.log('error: randomPath()')
			this.path = this.randomPath();
			this.head = [...this.path[this.path.length - 1]];
		}

		// remove that bit of the path
		this.path.splice(this.path.length - 1, 1);

		// check if head eating food
		if (this.head[0] != apple.pos[0] || this.head[1] != apple.pos[1]) {
			this.body.splice(0, 1);
		}
		else {
			apple.spawn()
		}
	}

	getNewPath(start = this.head, end = apple.pos) {
		var start = this.coordToIndex(start);
		var end = this.coordToIndex(end);

		var visited = new Array(height * width).fill(false);
		var previous = new Array(height * width).fill(undefined);
		var queue = [start];
		visited[start] = true;

		for (var i = 0; i < this.body.length; i++) {
			var dist = this.manhattanDistance(this.head[0], this.head[1], this.body[i][0], this.body[i][1]);
			if (dist <= i) {
				visited[this.coordToIndex(this.body[i])] = true;
			}
		}

		if (start != this.coordToIndex(this.head)) {
			visited[this.coordToIndex(this.head)] = true;
		}

		while (queue.length != 0) {
			var i = queue[0];
			queue.splice(0, 1);

			if (i == end) {
				break;
			}

			for (var n = 0; n < 4; n++) {
				var neighbor = i + neighbors[n];

				if (neighbor < 0 || neighbor > height * width || (n == 3 && i % width == 0) || (n == 1 && i % width == width - 1)) {
					continue;
				}

				if (!visited[neighbor]) {
					queue.push(neighbor);
					visited[neighbor] = true;
					previous[neighbor] = i;
				}
			}
		}

		if (i != end) {
			return false;
		}

		var path = [];

		while (i != start) {
			path.push(this.indexToCoord(i))
			i = previous[i];
		}

		return path;
	}

	followTail() {
		var path  = this.getNewPath(this.head, this.body[0]);
		return [path[path.length - 1]];
	}

	tailSight() {
		var nextHead = [...this.path[this.path.length - 1]];

		if (!this.getNewPath(nextHead, this.body[0])) {
			return false
		}

		// for (var n = 0; n < 8; n++) {
		// 	var neighbor = this.coordToIndex(nextHead) + neighbors8[n];

		// 	if (this.collide(this.indexToCoord(neighbor))) {
		// 		if (!this.getNewPath(nextHead, this.body[0])) {
		// 			return false
		// 		}
		// 	}
		// }

		return true;
	}

	randomPath() {
		var headIndex = this.coordToIndex(this.head)

		for (var n = 0; n < 4; n++) {
			var neighbor = headIndex + neighbors[n];

			if (neighbor < 0 || neighbor > height * width || (n == 3 && headIndex % width == 0) || (n == 1 && headIndex % width == width - 1)) {
				continue;
			}

			if (!this.collide(this.indexToCoord(neighbor))) {
				return [this.indexToCoord(neighbor)];
			}
		}

		var path = [[...this.body[this.body.length-1]]]

		console.log('death', path)
		return path;
	}

	collide(coord = this.head) {
		// if coord is colliding with the body
		for (var i = 0; i < this.body.length; i++) {
			if (coord[0] == this.body[i][0] && coord[1] == this.body[i][1]) {
				return true
			}
		}

		// if coord is odd the screen
		if (coord[0] < 0 || coord[0] >= width || coord[1] < 0 || coord[1] >= height) {
			return true
		}

		// no collision
		return false
	}

	coordToIndex(coord) {
		return width * coord[1] + coord[0]
	}

	indexToCoord(index) {
		return [index % width, Math.floor(index / width)]
	}

	manhattanDistance(x1, y1, x2, y2) {
		return Math.abs(x1 - x2) + Math.abs(y1 - y2);
	}

	display() {
		fill(0, 120, 0);
		rect(this.head[0] * scale, this.head[1] * scale, scale, scale);

		this.body.forEach(tail => {
			fill(30, 40 + (80 / this.body.length * this.body.indexOf(tail)), 30)
			rect(tail[0] * scale, tail[1] * scale, scale, scale);
		})
	}
}


class Apple {
	constructor() {
		this.pos = []

		this.spawn()
	}

	spawn() {
		this.pos[0] = Math.floor(Math.random() * width);
		this.pos[1] = Math.floor(Math.random() * height);

		if (this.pos[0] == snake.head[0] && this.pos[1] == snake.head[1]) {
			return this.spawn()
		}

		for (var i = 0; i < snake.body.length; i++) {
			if (this.pos[0] == snake.body[i][0] && this.pos[1] == snake.body[i][1]) {
				return this.spawn()
			}
		}
	}

	display() {
		fill(240, 0, 0)
		rect(this.pos[0] * scale, this.pos[1] * scale, scale, scale)
	}
}


function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}


function setup() {
	createCanvas(width * scale, height * scale);
	noStroke();
	frameRate(144);

	snake = new Snake();
	apple = new Apple();
}

function draw() {
	// move
	snake.move()

	// collide
	if (snake.collide()) {
		console.log('Gameover | score: ' + snake.body.length + ' (' + Math.round(1000 / (width * height - 1) * snake.body.length) / 10 + ')');

		if (snake.body.length > highscore) {
			highscore = snake.body.length;
		}

		sleep(2000);

		snake = new Snake();
		apple = new Apple();
	}

	// display
	background(30);

	snake.display();
	apple.display();

	// text
	fill(255);
	textSize(15);
	textAlign(RIGHT, TOP);
	text(snake.body.length + ' (' + Math.round(1000 / (width * height - 1) * snake.body.length) / 10 + ')', width * scale - 3, 3);
	text(highscore, width * scale - 3, 21);
	text(Math.floor(frameRate()), width * scale - 3, 39);
}

function keyPressed() {
}
