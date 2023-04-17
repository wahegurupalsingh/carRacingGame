var backgroundIMG, trackIMG;

var databaseOBJ;
var formOBJ;
var gameOBJ, gameState;
var playerOBJ, playerCount, allPlayers;
var carsAtFinish;

var car1, car2, car1IMG, car2IMG, cars;

var fuel, powerCoin, obstacle;
var fuelsGroup, powerCoinsGroup, obstaclesGroup;
var fuelIMG, powerCoinIMG, lifeIMG;
var obstacle1IMG, obstacle2IMG, blastIMG;

//Create Media library and load to use it during the course of the software
//executed only once at the start of the program
function preload() {
  trackIMG = loadImage("../assets/track.jpg");
  car1IMG = loadImage("../assets/car1.png");
  car2IMG = loadImage("../assets/car2.png");
  backgroundIMG = loadImage("../assets/background.png");

  fuelIMG = loadImage("../assets/fuel.png");
  powerCoinIMG = loadImage("../assets/goldCoin.png");
  lifeIMG = loadImage("../assets/life.png");

  obstacle1IMG = loadImage("../assets/obstacle1.png");
  obstacle2IMG = loadImage("../assets/obstacle2.png");
  blastIMG = loadImage("../assets/blast.png");
}

//define the initial environment of the software(before it is used)
//by defining the declared variables with default values
function setup() {
  createCanvas(displayWidth - 20, displayHeight - 30);

  //initialize the database-
  databaseOBJ = firebase.database();

  gameOBJ = new Game();

  gameState = 0; //0=WAIT, 1=PLAY, 2=END

  //function call to READ/RETRIEVE/GET existing value of gameState from database
  gameOBJ.getState();

  //function call to start the GAME i.e. gameState will activate  0 WAIT state
  gameOBJ.start();
}

//All modifications, changes, conditions, manipulations, actionscommands to be executed and checked, continuously or applied throughout the program are written inside function draw.
//function draw is executed for every frame created since the start of the program.
function draw() {
  background(backgroundIMG);

  //conditions for GAMESTATE to change from 0 to 1 to 2
  if (playerCount === 2) {
    /*
             function call to change existing value of gameState to a 
             new one based on the value of paramter passed in the database
        */
    gameOBJ.updateState(1);
  }

  if (gameState === 1) {
    clear();
    /*
            function call to activate the gameOBJ to START 1 mode and 
            aligned all players to starting positions at the start line
        */
    gameOBJ.play();
  }
}
