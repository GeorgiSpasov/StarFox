var player;
var score;
var battleField;
var enemyArr = [];
var enemyTimer;
var enemyAttackTimer;
var playBtn;
var playAgain;
var entryScreen;
var instructions;
var gameWidth;
var gameHeight;

if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = (function () {
		return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function ( /* function FrameRequestCallback */ callback,
						/* DOMElement Element */ element) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();
}

// Mobile controls =====================================================================
function update() {
	player.position.x += player.velocity.x;

	if (player.position.x > (gameWidth - 100) && player.velocity.x > 0) {
		player.position.x = gameWidth - 100;
	}
	if (player.position.x < 0 && player.velocity.x < 0) {
		player.position.x = 0;
	}
	player.style.left = player.position.x + "px";
	// Animation
	requestAnimationFrame(update);
}


function onLoad() {

	// Dimensions ======================================================================
	gameWidth = window.innerWidth;
	gameHeight = window.innerHeight;
	// Remove scroll bars
	document.documentElement.style.overflow = 'hidden';  // firefox, chrome
	document.body.scroll = "no"; // ie only

	// Create Battlefield ==============================================================
	battleField = document.createElement('DIV');
	battleField.id = 'battleField';
	battleField.style.height = gameHeight + 'px';
	battleField.style.width = gameWidth + 'px';
	battleField.style.display = 'none';
	document.body.appendChild(battleField);

	// Create entry screen =============================================================
	entryScreen = document.createElement('DIV');
	entryScreen.id = 'entryScreen';
	gameName = document.createElement('DIV');
	gameName.innerHTML = 'Star Fox';
	gameName.style.marginTop = gameHeight * 0.3 + 'px';
	entryScreen.appendChild(gameName);
	instructions = document.createElement('DIV');
	instructions.id = 'instructions';
	instructions.innerHTML = '<br>Intructions<br><br>Dodge the Meteors and Black Holes.<br><br>Left / Right Arrow Key to Move<br>Tilt for Mobile Devices';
	entryScreen.appendChild(instructions);

	playBtn = document.createElement('DIV');
	playBtn.id = 'play';
	playBtn.innerText = 'PLAY';
	playBtn.style.left = 100 + 'px';
	playBtn.style.top = 200 + 'px';
	playBtn.addEventListener("click", startGame, false);
	entryScreen.appendChild(playBtn);

	playAgain = document.createElement('DIV');
	playAgain.id = 'playAgain';
	playAgain.innerText = 'Play Again';
	playAgain.style.left = gameWidth / 2 - 100 + 'px';
	playAgain.style.top = gameHeight / 2 - 30 + 'px';

	playAgain.style.display = 'none';
	playAgain.addEventListener("click", startGame, false);
	document.body.appendChild(playAgain);

	document.body.appendChild(entryScreen);

	// Create player ===================================================================
	player = document.createElement('DIV');
	player.id = 'player';
	player.style.left = (gameWidth / 2) + "px";
	player.style.top = gameHeight - 50 + "px";
	player.velocity = { x: 0 };
	player.position = { x: 0 };
	player.style.display = 'none';
	playerSkin = document.createElement('IMG');
	playerSkin.src = "../img/shuttle.png";
	player.appendChild(playerSkin);
	document.body.appendChild(player);

	scoreBar = document.createElement('DIV');
	scoreBar.id = 'scoreBar';
	scoreBar.style.left = gameWidth * 0.01 + 'px';
	scoreBar.style.top = gameHeight * 0.01 + 'px';
	scoreBar.style.display = 'none';
	document.body.appendChild(scoreBar);


	if (window.DeviceOrientationEvent) {
		window.addEventListener('deviceorientation', function (event) {
			player.velocity.x = Math.round(event.gamma);
		}
		);
	}

	// Mobile browser check ================================================================
	window.mobileAndTabletcheck = function () {
		var check = false;
		(function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
		return check;
	};

	var mobileCheck = window.mobileAndTabletcheck();

	// Control choice
	if (mobileCheck) {
		update();
	}

} // End of onLoad()

function startGame() {
	score = 0;
	scoreBar.innerText = 'Score: ' + score;
	entryScreen.style.display = 'none';
	playAgain.style.display = 'none';
	battleField.style.display = 'block';
	scoreBar.style.display = 'inline';
	player.style.display = 'inline';
	player.style.backgroundColor = 'transparent';

	var enemies = document.getElementsByClassName('enemy');
	for (var i = 0; i < enemies.length; ++i) {
		var item = enemies[i];
		battleField.removeChild(item);
	}

	window.addEventListener('keydown', checkKeyPressed, false);
	createEnemy();
	enemyTimer = setInterval(createEnemy, 300);
	enemyAttackTimer = setInterval(enemyAttacks, 100);
}

// Player controls
function checkKeyPressed(e) {
	var rightKey = 39,
		leftKey = 37,
		upKey = 38;
	if (e.keyCode == rightKey && parseInt(player.style.left) < gameWidth - 100) {
		player.style.left = parseInt(player.style.left) + 50 + 'px';
	}
	if (e.keyCode == upKey) {
		if (player.style.backgroundColor == 'transparent')
			player.style.backgroundColor = '#ffffff';
		else
			player.style.backgroundColor = 'transparent';
	}
	if (e.keyCode == leftKey && parseInt(player.style.left) > 25) {
		player.style.left = parseInt(player.style.left) - 50 + 'px';
	}
}

function createEnemy() {
	var enemy = document.createElement("DIV");
	battleField.appendChild(enemy);
	enemy.className = 'enemy';
	enemy.style.top = '0px';
	enemy.style.left = Math.floor(Math.random() * gameWidth - 25) + 'px';
	if (Math.floor((Math.random() * 2)) == 0) {
		enemy.style.backgroundColor = '#000000';
	}
	else {
		enemy.style.backgroundColor = '#ffffff';
	}
	enemyArr.push(enemy);
}

function enemyAttacks() {
	var enemies = document.getElementsByClassName('enemy');
	for (var i = 0; i < enemies.length; ++i) {
		var item = enemies[i];
		item.style.top = parseInt(item.style.top) + 50 + 'px';

		// Player hit
		if (parseInt(item.style.top) > gameHeight - 50 &&
			parseInt(player.style.left) - 48 <= parseInt(item.style.left) &&
			parseInt(item.style.left) <= parseInt(player.style.left) + 48) {

			player.style.backgroundColor = '#ff0000';
			clearInterval(enemyTimer);
			clearInterval(enemyAttackTimer);
			window.removeEventListener('keydown', checkKeyPressed, false);
			playAgain.style.display = 'inline';
		}

		if (parseInt(item.style.top) > gameHeight) {
			battleField.removeChild(item);
			score += 1;
			scoreBar.innerText = 'Score: ' + score;
		}
	}
}