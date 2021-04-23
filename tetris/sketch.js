const spacing = 32;
const width = 18 * spacing;
const height = 25 * spacing;

const I = [[0, 0], [-1, 0], [1, 0], [2, 0]];  // I-block
const O = [[0, 0], [1, 0], [0, -1], [1, -1]];  // O-block
const T = [[0, 0], [-1, 0], [1, 0], [0, -1]];  // T-block
const Z = [[0, 0], [0, -1], [-1, -1], [1, 0]];  // Z-block
const S = [[0, 0], [-1, 0], [0, -1], [1, -1]];  // S-block
const L = [[0, 0], [-1, 0], [1, 0], [1, -1]];  // L-block
const J = [[0, 0], [-1, 0], [-1, -1], [1, 0]];  // J-block

const pieces = [I, O, T, Z, S, L, J];
const piecesColor = [[3, 244, 252], [255, 247, 0], [230, 0, 255], [222, 28, 3], [35, 212, 19], [255, 174, 0], [0, 68, 255]];

var piece = { info: null, type: null };
var base = [];
var baseColor = [];
var nextPieces = [
	pieces[Math.floor(Math.random() * 7)]
];

var maxFrame = 100;
var frame = 0;
var score = 0;

var paused = false;
var showColor = true;
var fast = true;
var moveFast = 5;

function setup() {
	createCanvas(width, height);
	frameRate(100);
	textSize(25)
	textAlign(LEFT, TOP)

	newPiece();
}

function draw() {
	if (!paused) {
		if (frame % 5 == 0) {
			if (keyIsDown(65)) {
				if (moveFast > 0) {
					moveFast--;
				}
				else {
					translatePiece(-1, 0);
					if (pieceContact() || outOfBounds()) {
						translatePiece(1, 0)
					}
				}
			}
			if (keyIsDown(68)) {
				if (moveFast > 0) {
					moveFast--;
				}
				else {
					translatePiece(1, 0);
					if (pieceContact() || outOfBounds()) {
						translatePiece(-1, 0)
					}
				}
			}
		}

		if (frame == 0 || (keyIsDown(16) && frame % 5 == 0 && fast)) {
			translatePiece(0, 1);
			BottomCheck();
		}

		frame += 1;
		if (frame >= maxFrame) { frame = 0 }
	}

	background(60);
	stroke(0);

	drawProjection();

	drawPiece(piece.info, 'p');

	drawPiece(base, 'b');

	for (var i = 0; i < nextPieces.length; i++) {
		drawPiece(nextPieces[i], 'np', 15, 2 + 3 * i);
	}

	stroke(255);
	line(13 * spacing, 0, 13 * spacing, height);
	line(13 * spacing, 10 * spacing, width, 10 * spacing);

	fill(255);
	noStroke();
	text('score: ' + score + '\n' + Math.floor(maxFrame) / 100 + 's\n\nA (left)\nD (right)\nR (rotate)\nshift (fast)\nC (color)\nP (pause)\n', 13 * spacing + 8, 10 * spacing + 8);

	if (paused) {
		text('PAUSED', 5, 5);
	}
}

function keyPressed() {
	if (!paused) {
		if (keyCode == 65) {  // a (left)
			translatePiece(-1, 0)
			if (pieceContact() || outOfBounds()) {
				translatePiece(1, 0)
			}
		}
		if (keyCode == 68) {  // d (right)
			translatePiece(1, 0)
			if (pieceContact() || outOfBounds()) {
				translatePiece(-1, 0)
			}
		}
		if (keyCode == 82) {  // r (rotate)
			rotatePiece()
			if (pieceContact() || outOfBounds()) {
				rotatePiece(-1)
			}
		}
	}
	if (keyCode == 16) {  // shift (fast down)
		fast = true;
	}
	if (keyCode == 67) {  // c (toggle color)
		showColor = !showColor;
	}
	if (keyCode == 80 || keyCode == 32) {  // p (toggle pause)
		paused = !paused;
	}
}

function keyReleased() {
	if (keyCode == 16) { fast = true; }
	if (keyCode == 65 || keyCode == 68) { moveFast = 5; }
}

function mousePressed() {
	if (!paused) {
		if (mouseButton == 'left') {
			var dif = Math.floor(mouseX / spacing) - piece.info[0][0];
			var move = 1;
			if (dif < 0) {
				move = -1;
			}
			for (var i = 0; i < Math.abs(dif); i++) {
				translatePiece(move, 0)
				if (pieceContact() || outOfBounds()) {
					translatePiece(-move, 0)
				}
			}
		}
	}
}

function newPiece() {
	piece.type = nextPieces[0];
	piece.info = [];
	nextPieces.splice(0, 1);

	var p = pieces[pieces.indexOf(piece.type)];

	for (var i = 0; i < p.length; i++) {
		piece.info.push([...p[i]]);
	}

	while (nextPieces.length != 3) {
		var newNextPiece = pieces[Math.floor(Math.random() * 7)];

		for (var i = 0; i < nextPieces.length; i++) {
			if (nextPieces[i] == newNextPiece) {
				newNextPiece = false;
			}
		}

		if (piece.type == newNextPiece) {
			newNextPiece = false;
		}

		if (newNextPiece) {
			nextPieces.push(newNextPiece);
		}
	}

	translatePiece(6, 1);

	fast = false;
	moveFast = 5;
}

function drawPiece(p, type, x = 0, y = 0) {
	if (type == 'np') {
		if (pieces.indexOf(p) === 0) {
			x -= 0.5;
			y -= 0.5;
		}
		else if (pieces.indexOf(p) == 1) {
			x -= 0.5;
		}
	}

	for (var i = 0; i < p.length; i++) {
		if (type == 'b' && showColor) {
			fill(baseColor[i])
		}
		else if (type == 'p' && showColor) {
			fill(piecesColor[pieces.indexOf(piece.type)])
		}
		else if (type == 'np' && showColor) {
			fill(piecesColor[pieces.indexOf(p)])
		}
		else if (type == 'pp') {
			fill(40);
		}
		else {
			fill(255);
		}

		rect((p[i][0] + x) * spacing, (p[i][1] + y) * spacing, spacing, spacing);
	}
}

function drawProjection() {
	for (var i = 0; i < 25; i++) {
		for (var j = 0; j < piece.info.length; j++) {
			if (piece.info[j][1] + i >= 25) {
				drawPiece(piece.info, 'pp', 0, i - 1);
				return;
			}
			for (var b = 0; b < base.length; b++) {
				if (piece.info[j][0] == base[b][0] && piece.info[j][1] + i == base[b][1]) {
					drawPiece(piece.info, 'pp', 0, i - 1);
					return;
				}
			}
		}
	}
}

function translatePiece(x, y) {
	for (var i = 0; i < piece.info.length; i++) {
		piece.info[i][0] += x;
		piece.info[i][1] += y;
	}
}

function rotatePiece(r = 1) {
	if (piece.type == O) { return }

	var xT = piece.info[0][0];
	var yT = piece.info[0][1];

	for (var i = 1; i < piece.info.length; i++) {
		var x = piece.info[i][0] - xT;
		var y = piece.info[i][1] - yT;

		piece.info[i][0] = (r * -y) + xT;
		piece.info[i][1] = (r * x) + yT;
	}
}

function outOfBounds() {  // checks if piece has gone too far left/right
	for (var i = 0; i < piece.info.length; i++) {
		if (piece.info[i][0] < 0 || piece.info[i][0] >= 13) {
			return true
		}
	}
	return false
}

function pieceContact() {  // checks if piece has hit the floor or base
	for (var i = 0; i < piece.info.length; i++) {
		if (piece.info[i][1] >= 25) {
			return true
		}
		for (var j = 0; j < base.length; j++) {
			if (piece.info[i][0] == base[j][0] && piece.info[i][1] == base[j][1]) {
				return true
			}
		}
	}
	return false
}

function BottomCheck() {  // if piece has hit the floor or base, does stuff
	if (pieceContact()) {
		translatePiece(0, -1);

		for (var i = 0; i < piece.info.length; i++) {  // adds the piece to the base
			base.push([...piece.info[i]])
			baseColor.push([...piecesColor[pieces.indexOf(piece.type)]])
		}

		newPiece();
		rowCompleteCheck();

		if (pieceContact()) {  // if new piece contacts the base, its game over
			console.log('Game over - final score:', score)
			newPiece();
			base = [];
			baseColor = [];
			maxFrame = 100;
			frame = 0;
			score = 0;
		}
	}
}

function rowCompleteCheck() {  // checks if a row is complete
	var c = Array(25).fill(0)

	for (var i = 0; i < base.length; i++) {
		c[base[i][1]]++;
	}

	for (var i = 0; i < c.length; i++) {
		if (c[i] == 13) {  // complete row

			score++;

			maxFrame = Math.round((2500 / (score + 28))) + 10;

			var baseLength = base.length;

			for (var j = 0; j < baseLength; j++) {

				if (base[j][1] == i) {
					base.splice(j, 1);
					baseColor.splice(j, 1);
					j--;
					baseLength--;
				}

				else if (base[j][1] < i) {
					base[j][1]++;
				}

			}
		}
	}
}
