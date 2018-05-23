//
const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 500

const BLOCK_WIDTH = 50
const BLOCK_HEIGHT = 25

const gInput = new InputManager()
const gStages = new Map()
const gsm = new StageManager()
let gTextures = {}
let gSounds = {}


let now = 0
let ex = 0
let dt = 0

let timer=0
let fps=0

let pfps

function preload() {

	gTextures["paddle"] = loadImage("assets/images/paddle.bmp")
	gTextures["ball"] = loadImage("assets/images/ball.png")
	gTextures["block_blue"] = loadImage("assets/images/block_blue.png")
	gTextures["block_green"] = loadImage("assets/images/block_green.png")
	gTextures["block_red"] = loadImage("assets/images/block_red.png")
	gTextures["block_yellow"] = loadImage("assets/images/block_yellow.png")
	
	gSounds["game"] = loadSound("assets/musics/song.ogg")
	gSounds["menu"] = loadSound("assets/musics/menu.mp3")

	gSounds["bounce"] = loadSound("assets/sounds/ball_bounce.ogg")
	gSounds["explosion"] = loadSound("assets/sounds/explosion.ogg")
	gSounds["spawn"] = loadSound("assets/sounds/ball_spawn.ogg")
}

function setup() {
	createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

	gStages.set("introduction", new IntroStage(gsm))
	gStages.set("play", new PlayStage(gsm))
	gStages.set("gameover", new OverStage(gsm))

	gsm.pushStage(gStages.get("introduction"))
	//gsm.pushStage(gStages.get("gameover"))

	pfps= createP('')
}

function draw() {

	background(51)
	now = millis()
	dt = (now - ex) / 1000
	//
	timer+=dt
	fps++

	if(timer >1.0)
	{
		pfps.html("fps= "+fps)
		timer=0
		fps=0
	}
	//
	gsm.update(dt)

	gInput.update()

	gsm.render()

	//
	ex = now
}


function keyPressed() {
	gInput.setKeyboardPressed(keyCode)
}

function keyReleased() {
	gInput.setKeyboardReleased(keyCode)
}

function mousePressed() {
	//matrice.action_rotate()
	//console.log("x= "+mouseX)
}