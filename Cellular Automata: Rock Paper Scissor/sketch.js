const scale = 6;
const width = 200;  // 960
const height = 150;  // 466
const len = width * height;

var colors = 3  // 3 or 5

function setup() {
	createCanvas(width * scale, height * scale);
	noStroke();
	frameRate(30);
	fill(30);

	grid = []

	for (i = 0; i < len; i++) {
		grid.push({ state: 0, nextState: 0, neighbors: [], id: i })
	}

	for (i = 0; i < grid.length; i++) {
		if (grid[i - width] != undefined) {  // up
			grid[i].neighbors.push(grid[i - width])
		}
		if (grid[i + width] != undefined) {  // down
			grid[i].neighbors.push(grid[i + width])
		}
		if (i % width != 0) {  // left
			grid[i].neighbors.push(grid[i - 1])
		}
		if (i % width != width - 1) {  // right
			grid[i].neighbors.push(grid[i + 1])
		}
		if (grid[i - width] != undefined && i % width != 0) {  // up left
			grid[i].neighbors.push(grid[i - width - 1])
		}
		if (grid[i - width] != undefined && i % width != width - 1) {  // up right
			grid[i].neighbors.push(grid[i - width + 1])
		}
		if (grid[i + width] != undefined && i % width != 0) {  // down left
			grid[i].neighbors.push(grid[i + width - 1])
		}
		if (grid[i + width] != undefined && i % width != width - 1) {  // down right
			grid[i].neighbors.push(grid[i + width + 1])
		}
	}

	for (i = 0; i < grid.length; i++) {
		var r = Math.floor(Math.random() * colors)
		grid[i].state = r;
		grid[i].nextState = r;
	}
}

function draw() {
	background(209, 75, 69);
	if (colors == 3) {
		gridSimulate3();
	}
	else {
		gridSimulate5();
	}
	gridDraw();
}

function gridSimulate3() {
	for (i = 0; i < grid.length; i++) {
		n = [0, 0, 0];
		grid[i].neighbors.forEach(neighbor => { n[neighbor.state] += 1 })

		if (grid[i].state == 0 && n[2] > 2) { grid[i].nextState = 2 }
		else if (grid[i].state == 1 && n[0] > 2) { grid[i].nextState = 0 }
		else if (grid[i].state == 2 && n[1] > 2) { grid[i].nextState = 1 }
	}
}

function gridSimulate5() {
	for (i = 0; i < grid.length; i++) {
		n = [0, 0, 0, 0, 0];
		grid[i].neighbors.forEach(neighbor => { n[neighbor.state] += 1 })

		if (grid[i].state == 0) {
			if (n[3] > 2) { grid[i].nextState = 3 }
			else if (n[4] > 2) { grid[i].nextState = 4 }
		}
		else if (grid[i].state == 1) {
			if (n[0] > 2) { grid[i].nextState = 0 }
			else if (n[4] > 2) { grid[i].nextState = 4 }
		}
		else if (grid[i].state == 2) {
			if (n[0] > 2) { grid[i].nextState = 0 }
			else if (n[1] > 2) { grid[i].nextState = 1 }
		}
		else if (grid[i].state == 3) {
			if (n[1] > 2) { grid[i].nextState = 1 }
			else if (n[2] > 2) { grid[i].nextState = 2 }
		}
		else if (grid[i].state == 4) {
			if (n[2] > 2) { grid[i].nextState = 2 }
			else if (n[3] > 2) { grid[i].nextState = 3 }
		}
	}
}

function gridDraw() {
	for (i = 0; i < grid.length; i++) {
		grid[i].state = grid[i].nextState

		if (grid[i].state == 1) { fill(44, 172, 117) }
		else if (grid[i].state == 2) { fill(40, 91, 102) }
		else if (grid[i].state == 3) { fill(226, 201, 138) }
		else if (grid[i].state == 4) { fill(235, 164, 86) }

		if (grid[i].state != 0) {
		rect(i % width * scale, Math.floor(i / width) * scale, scale, scale)
		}

	}
}