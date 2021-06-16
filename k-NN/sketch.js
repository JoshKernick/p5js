const width = 800;
const height = 600;


class Data {
	constructor() {
		this.data = [[194, 47, 0], [193, 107, 0], [129, 152, 0], [58, 217, 0], [87, 144, 0], [51, 65, 0], [139, 31, 0], [135, 93, 0], [35, 115, 0], [92, 194, 0], [209, 160, 0], [445, 45, 0], [573, 45, 0], [592, 45, 0], [679, 92, 0], [689, 108, 0], [588, 142, 0], [416, 90, 0], [353, 52, 0], [207, 34, 0], [518, 50, 0], [621, 89, 0], [729, 159, 0], [754, 218, 0], [735, 285, 0], [674, 355, 0], [679, 363, 0], [775, 397, 0], [763, 400, 0], [658, 320, 0], [521, 273, 0], [709, 314, 0], [640, 228, 0], [673, 178, 0], [699, 210, 0], [667, 271, 0], [580, 239, 0], [749, 194, 0], [567, 141, 0], [769, 36, 0], [598, 112, 0], [443, 194, 0], [571, 258, 0], [631, 200, 0], [510, 190, 0], [653, 177, 0], [469, 144, 0], [47, 400, 0], [161, 374, 0], [81, 405, 0], [67, 506, 0], [239, 545, 0], [424, 552, 0], [548, 585, 0], [337, 543, 0], [352, 445, 0], [339, 562, 0], [195, 577, 0], [300, 517, 0], [214, 406, 0], [111, 492, 0], [86, 565, 0], [165, 571, 0], [235, 484, 0], [276, 453, 0], [139, 426, 0], [217, 530, 0], [185, 538, 0], [326, 584, 0], [454, 581, 0], [335, 499, 0], [4, 327, 1], [94, 251, 1], [88, 260, 1], [34, 290, 1], [158, 363, 1], [135, 310, 1], [234, 200, 1], [100, 289, 1], [32, 371, 1], [176, 348, 1], [156, 278, 1], [103, 307, 1], [111, 366, 1], [187, 326, 1], [249, 253, 1], [254, 151, 1], [310, 95, 1], [280, 52, 1], [300, 200, 1], [381, 238, 1], [372, 146, 1], [324, 153, 1], [354, 243, 1], [253, 320, 1], [196, 257, 1], [278, 333, 1], [247, 372, 1], [228, 296, 1], [348, 263, 1], [373, 343, 1], [495, 326, 1], [501, 320, 1], [590, 353, 1], [693, 425, 1], [763, 463, 1], [747, 554, 1], [659, 584, 1], [662, 551, 1], [731, 533, 1], [748, 478, 1], [732, 435, 1], [697, 513, 1], [505, 476, 1], [432, 356, 1], [438, 284, 1], [420, 471, 1], [601, 468, 1], [653, 474, 1], [587, 533, 1], [513, 493, 1], [540, 389, 1], [464, 404, 1], [658, 449, 1], [583, 415, 1], [501, 468, 1], [403, 399, 1], [315, 359, 1], [365, 303, 1], [294, 292, 1], [295, 242, 1], [416, 302, 1], [623, 428, 1], [595, 415, 1], [578, 375, 1], [541, 342, 1], [510, 404, 1], [580, 497, 1]]
		this.dataLength = this.data.length;
	}

	k_nearest_neighbors(k, x = mouseX, y = mouseY) {  // finds k nearest neighbors, returns an array of length k of nearest neighbors
		var nn = [];
		var nn_distance = [];

		for (var j = 0; j < k; j++) {  // populate nn and nn_distance
			nn.push(undefined);
			nn_distance.push(Infinity);
		}

		for (var i = 0; i < this.dataLength; i++) {  // put closest neighbors from this.data into nn, and their distances into nn_distance
			var point = this.data[i];
			var distance = getDistance(x, y, point[0], point[1]);
			var best = -1;
			for (var j = 0; j < k; j++) {
				if (distance < nn_distance[j]) {
					best = j;
				}
				else {
					break;
				}
			}
			if (best > -1) {
				for (var j = 0; j < best; j++) {
					nn[j] = nn[j + 1];
					nn_distance[j] = nn_distance[j + 1];
				}
				nn[best] = point;
				nn_distance[best] = distance;
			}
		}

		var type = 0;  // finds what type the new point is
		for (var i = 0; i < k; i++) {
			if (nn[i][2] == 0) {
				if (weight_distance) {
					type -= (1 / nn_distance[i])
				}
				else {
					type--
				}
			}
			else {
				if (weight_distance) {
					type += (1 / nn_distance[i])
				}
				else {
					type++
				}
			}
		}

		return { x: x, y: y, k: k, nn: nn, nn_distance: nn_distance, wd: weight_distance, type: type };
	}

	display() {
		for (var i = 0; i < this.dataLength; i++) {
			if (this.data[i][2] == 0) { fill(0, 150, 180); }
			else { fill(200, 50, 50); }
			ellipse(this.data[i][0], this.data[i][1], 10, 10);
		}
	}
}

function setup() {
	createCanvas(width, height);
	noStroke();
	cursor(CROSS);
	textSize(15);
	textAlign(LEFT, TOP);
	frameRate(60);

	data = new Data();
	k = 5
	weight_distance = true;

	k_nn = data.k_nearest_neighbors(k);

	blueDots = [];
	redDots = [];
	blueLen = -1;
	redLen = -1;

	updateBackground();
}

function draw() {
	background(30);

	// draws blue background dots
	fill(0, 75, 90);
	for (var i = 0; i < blueLen; i++) {
		ellipse(blueDots[i][0], blueDots[i][1], 2, 2);
	}

	// draws red background dots
	fill(100, 25, 25);
	for (var i = 0; i < redLen; i++) {
		ellipse(redDots[i][0], redDots[i][1], 2, 2);
	}

	// finds k nearest neighbors of the mouse
	if (k_nn.x != mouseX || k_nn.y != mouseY || k != k_nn.k || weight_distance != k_nn.wd) {
		k_nn = data.k_nearest_neighbors(k);
	}

	// draws heighlights around k nearest neighbors
	fill(255);
	for (var i = 0; i < k; i++) {
		if (weight_distance) {
			fill(255 - (225 / k_nn.nn_distance[0]) * k_nn.nn_distance[i])  // 255 -> 55
		}
		ellipse(k_nn.nn[i][0], k_nn.nn[i][1], 12, 12);
	}

	// draws all data points
	data.display();

	// draws circles around k nearest neighbors from mouse
	noFill();
	if (k_nn.type < 0) { stroke(0, 150, 180) }
	else if (k_nn.type > 0) { stroke(200, 50, 50); }
	else { stroke(255); }
	arc(k_nn.x, k_nn.y, k_nn.nn_distance[0] * 2, k_nn.nn_distance[0] * 2, 0, PI + PI);
	noStroke();

	fill(255);
	text('k: ' + k, 3, 3);
	text('type: ' + Math.round(k_nn.type * 100) / 100, 3, 21);
	if (weight_distance) { text('weighted distance', 3, 39); }
	else { text('simple majority', 3, 39); }
}

function keyPressed() {
	if (keyCode == 32) {
		weight_distance = !weight_distance;
		updateBackground();
	}
}

function mousePressed() {
	if (mouseButton == 'left') {
		weight_distance = !weight_distance;
		updateBackground();
	}
}

function mouseWheel() {
	if (event.delta == -100 && k < data.dataLength) {
		k++
		updateBackground();
	}
	else if (event.delta == 100 && k > 1) {
		k--
		updateBackground();
	}
	return false
}

function updateBackground() {
	blueDots = [];
	redDots = [];
	var len = width * height / 10
	for (i = 0; i < len; i += 10) {
		var x = i % width + 5;
		var y = Math.floor(i / width) * 10 + 5;
		var k_nn = data.k_nearest_neighbors(k, x, y);
		if (k_nn.type < 0) { blueDots.push([x, y]) }
		else if (k_nn.type > 0) { redDots.push([x, y]) }
	}
	blueLen = blueDots.length;
	redLen = redDots.length;
}

function getDistance(x1, y1, x2, y2) {
	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}
