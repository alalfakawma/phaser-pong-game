var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload : preload, create : create, update : update});

function preload() {
	game.load.image('paddle', 'assets/paddle.png');
	game.load.image('ball', 'assets/ball.png');

	this.game.scale.pageAlignHorizontally = true;
	this.game.scale.pageAlignVertically = true;
	this.game.scale.refresh();
}

var paddle1;
var paddle2;
var ball_launched;
var ball_velocity;
var paddle1_score;
var paddle2_score;
var score1;
var score2;

function create() {

	ball_launched = false;
	ball_velocity = 400;

	ball = addBall(game.world.centerX, game.world.centerY);
	paddle1 = addPaddle(0, game.world.centerY);
	paddle2 = addPaddle(game.world.width - 10, game.world.centerY);

	game.input.onDown.add(launch_ball, this);

	titleText = game.add.text(game.world.centerX, 20, 'By : Aseem Lalfakawma', {
		font: "24px sans-serif",
		fill: "#E0FFFF",
		align: "center"
	});

	insText = game.add.text(game.world.centerX, 60, 'Click to start', {
		font: "20px sans-serif",
		fill: "#E0FFFF",
		align: "center"
	});

	insText.anchor.setTo(0.5, 0.5);
	titleText.anchor.setTo(0.5, 0.5);

	paddle1_score = game.add.text(128, 128, '0', {
		font: "32px sans-serif",
		fill: "#ffffff",
		align: "center"
	});

	paddle2_score = game.add.text(game.world.width - 128, 128, '0', {
		font: "32px sans-serif",
		fill: "#ffffff",
		align: "center"
	});

	score1 = 0;
	score2 = 0;

}

function update() {

	if (ball_launched) {
		insText.visible = false;
	} else {
		insText.visible = true;
	}

	paddle1_score.text = score1;
	paddle2_score.text = score2;

	// set controls and collisions for ball and paddle

	paddle_controller(paddle1, game.input.y);
	game.physics.arcade.collide(paddle1, ball);
	game.physics.arcade.collide(paddle2, ball);

	// check for collisions to side of wall

	if(ball.body.blocked.left) {
		score2++;
		launch_ball();
	} else if(ball.body.blocked.right) {
		score1++;
		launch_ball();
	}

	// set the ai difficulty

	paddle2.body.velocity.setTo(ball.body.velocity.y);
	paddle2.body.velocity.x = 0;
	paddle2.body.maxVelocity.y = 250;
	
	// restart game when game point is reached

	if (score1 == 10 || score2 == 10) {
		alert('Game Over');
		location.reload();
	}

}

// add functions for sprites

function addPaddle(x,y) {
	var paddle = game.add.sprite(x, y, 'paddle');
	paddle.anchor.setTo(0.5, 0.5);
	game.physics.arcade.enable(paddle);
	paddle.body.collideWorldBounds = true;
	paddle.body.immovable = true;

	return paddle;
}

function addBall(x,y) {
	var ball = game.add.sprite(x, y, 'ball');
	ball.anchor.setTo(0.5, 0.5);
	game.physics.arcade.enable(ball);
	ball.body.collideWorldBounds = true;
	ball.body.bounce.setTo(1,1);

	return ball;
}

// control paddle movement

function paddle_controller(paddle,y) {
	paddle.y = y;

	if (paddle.y < paddle.height / 2) {
		paddle.y = paddle.height / 2;
	} else if (paddle.y > game.world.height - paddle.height / 2) {
		paddle.y = game.world.height - paddle.height / 2;
	}
}

function launch_ball() {
	if (ball_launched) {
		ball.x = game.world.centerX;
		ball.y = game.world.centerY;
		ball.body.velocity.setTo(0, 0);
		ball_launched = false;
	} else {
		ball.body.velocity.setTo(-ball_velocity, game.rnd.integerInRange(50, 285));
		ball_launched = true;
	}
}