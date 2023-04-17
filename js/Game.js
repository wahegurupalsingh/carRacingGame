/*
    ● Game object  should be able to hold the state of the game. It should be able to display form when the game state is 0(WAIT) 
    or the game when the game state is 1(PLAY) or leaderboard when the game state is 2(END).
    ● GAMESTATES: 0 WAIT
              1 START
              2 END
*/

class Game {
  /*   
    writing code to create objects even though the blueprint/CONSTRUCTOR isn't
    defined yet. This is called writing code using abstraction 
  */
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;

    this.leftKeyActive = false;
    this.blast = false;
  }

  /*
    function definition to get/read/retrieve existing value of gameState from database
  */
  getState() {
    var gameStateRef = databaseOBJ.ref("GAMESTATE");
    gameStateRef.on("value", function (data) {
      gameState = data.val();
    });
  }

  /*
      function definition to change existing value of gameState to a 
      new one based on the value of paramter passed in the database
    */
  updateState(newStateInput) {
    databaseOBJ.ref("/").update({
      GAMESTATE: newStateInput,
    });
  }

  /*
    function defintion to start the GAME i.e. gameState will remain in WAIT(0) state 
    displaying the FORM until all 4 players are registered
  */
  start() {
    //as long as gameState is on WAIT
    playerOBJ = new Player(); //generate a new playerOBJ
    playerCount = playerOBJ.getCount(); //get the number of players registered

    formOBJ = new Form(); //create new formObj for registration
    formOBJ.display(); //display the generated formObj

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1IMG", car1IMG);
    car1.addImage("blastIMG", blastIMG);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2IMG", car2IMG);
    car2.addImage("blastIMG", blastIMG);
    car2.scale = 0.07;

    cars = [car1, car2];

    fuelsGroup = new Group();

    powerCoinsGroup = new Group();

    obstaclesGroup = new Group();

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2IMG },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2IMG },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2IMG },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2IMG },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2IMG },
      { x: width / 2, y: height - 2800, image: obstacle2IMG },

      { x: width / 2 - 180, y: height - 3300, image: obstacle1IMG },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1IMG },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1IMG },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1IMG },
      { x: width / 2 - 180, y: height - 5500, image: obstacle1IMG },
      { x: width / 2, y: height - 5300, image: obstacle1IMG },
    ];

    /* function calls to add and create obstacles randomly on the track*/
    this.addSprites(
      obstaclesGroup,
      obstaclesPositions.length,
      obstacle1IMG,
      0.04,
      obstaclesPositions
    );

    // Adding fuel sprites in the game
    this.addSprites(fuelsGroup, 4, fuelIMG, 0.02);

    // Adding coin sprites in the game
    this.addSprites(powerCoinsGroup, 18, powerCoinIMG, 0.09);
  }

  //function definition to add sprite object to a group
  // it is added only after the sprite object is created fully
  // and has been applied full modifications such as image, velocity, scale, position, etc
  addSprites(
    spriteGroupInput,
    numberOfSprites,
    spriteImageInput,
    scaleInput,
    positions = []
  ) {
    /* In this loop, i variable = 0 and if i is less than the number of sprites in 
    the group then the game should add another i. Everytime the loop repeats it creates a new sprite, 
    gives it a random x and y, gives it the animation or picture, stes the scale and then adds it to the
    group that we have created. The loop function will repeat as long as the given condition is true.
    Basically it gives the sprites the properties and makes a new sprite which is part of the group.*/
    for (var i = 0; i < numberOfSprites; i++) {
      /* 
      This command is for the condition that is given in order for the loop to work.
      The loop will only work as long as this condition is true and if it is not true the functions wont
      take place and a new sprite wont be created.
      */
      var newX, newY;

      /* this line is saying that if the length of the x and y positions is more than 0 the 
        commands bellow will be executed*/
      if (positions.length > 0) {
        /*This command  extracts the x pos for the cuurrent object from the array to assign its value 
        to xposition for the newly created sprite.*/
        newX = positions[i].x;
        /*This command  extracts the x pos for the cuurrent object from the array to assign its value 
        to yposition for the newly created sprite.*/
        newY = positions[i].y;

        spriteImageInput = positions[i].image;
      } else {
        //if the criteria above in the if statement is not met, this code below will run
        // that means, if no more objects are avialbale in the loop, then generate random values within the given range
        // for x and y positions respectively
        newX = random(width / 2 + 150, width / 2 - 150);
        newY = random(-height * 4.5, height - 400);
      }

      //once, the x and y positions are finalised, new sprite objec t will be created based off those values
      //the image file passed as part of the objects in the loop will be assigned, otherwise the image variable passed as parameter will be used instead
      var sprite = createSprite(newX, newY);
      sprite.addImage("sprite", spriteImageInput);

      //the scale value passed as 4th parameter will be used here
      sprite.scale = scaleInput;
      //taking the new sprite we just created and adding/storing it into the group parameter.
      spriteGroupInput.add(sprite);
    }
  }

  showLifeBar() {
    push();

    //image of life icon
    image(lifeIMG, width / 2 - 130, height - playerOBJ.positionY - 360, 20, 20);
    fill("white");
    //this is rect outline of lifebar
    rect(width / 2 - 100, height - playerOBJ.positionY - 360, 185, 20);
    fill("#f50057");
    //filler solid rect showing yellow inside the outline
    rect(
      width / 2 - 100,
      height - playerOBJ.positionY - 360,
      playerOBJ.life,
      20
    );
    noStroke();
    pop();
  }

  showFuelBar() {
    push();
    //image of fuel icon
    image(fuelIMG, width / 2 - 130, height - playerOBJ.positionY - 350, 20, 20);
    fill("white");
    //this is rect outline of fuelbar
    rect(width / 2 - 100, height - playerOBJ.positionY - 350, 185, 20);
    fill("#ffc400");
    //filler solid rect showing red inside the outline
    rect(
      width / 2 - 100,
      height - playerOBJ.positionY - 350,
      playerOBJ.fuel,
      20
    );
    noStroke();
    pop();
  }

  handleElements() {
    //handle form  element
    formOBJ.hide();
    formOBJ.titleIMG.position(40, 50);
    formOBJ.titleIMG.size(100, 100);

    this.resetTitle.html("RESTART");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Leaderboard");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 100);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 180);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 200);
  }

  /*
    function defintion to activate the gameObj to START 1 mode and 
    aligned all players to starting positions at the start line
  */
  play() {
    this.handleElements();
    this.handleResetButton();
    //function call to get information for all participating players
    Player.getPlayersInfo();
    playerOBJ.getCarsAtEnd();

    //preparin the track and the players allignment or positions
    if (allPlayers !== undefined) {
      image(trackIMG, 0, -height * 5, width, height * 6);
      //after recieving player info : display leader board, life bar, fuel bar
      this.showLeaderBoard();
      this.showFuelBar();
      this.showLifeBar();

      //starting value of assumed index of the array
      var index = 0;

      //for every playerOBJ object inside allPlayers
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //position the cars a little away from each other in x direction
        //use data form the database to display the cars in x and y direction
        console.log(allPlayers[plr]);
        var calculatedX = allPlayers[plr].POSNX; //positionX
        var calculatedY = height - allPlayers[plr].POSNY;

        // console.log(cars);
        // calculating the value of life left for the current player
        var currentLife = allPlayers[plr].LIFE;
        if (currentLife <= 0) {
          cars[index - 1].changeImage("blastIMG");
          cars[index - 1].scale = 0.5;
        }

        cars[index - 1].position.x = calculatedX;
        cars[index - 1].position.y = calculatedY;

        if (index === playerOBJ.index) {
          cars[index - 1].shapeColor = "red";

          /*  
          The game camera allows us to change how and from where we are viewing the game.
          We want the Game Camera to be focused on each  player's car. We can set the camera position in the game
          differently for each player. assigning camera with the same position with the car. Here we are setting the 
          camera position x and position y according to the player’s car position. We will restrict the movement of 
          cars to stay on track. For that, we can keep the x position of the camera to align with the x position of a car. 
          Our cars move forward, so we will align the position ofthe camera with the position of the car.
          */
          camera.position.x = displayWidth / 2;
          camera.position.y = cars[index - 1].position.y;

          //Creating an indicator below the car
          fill("yellow");
          stroke("yellow");
          strokeWeight(10);
          ellipse(calculatedX, calculatedY, 100, 100);

          this.handleFuel(index);
          this.handlePowerCoins(index);
          this.handleCarACollisionWithCarB(index);
          this.handleObstacleCollision(index);

          if (playerOBJ.life <= 0) {
            this.blast = true;
            this.playerMoving = false;
            this.gameOver();
          }
        }

        if (this.playerMoving) {
          playerOBJ.positionY += 5;
          playerOBJ.updatePlayerInfo();
        }

        // handling keyboard events
        this.handlePlayerControls();

        // Finshing Line
        const finshLine = height * 6 - 100;

        if (playerOBJ.positionY > finshLine) {
          gameState = 2;
          playerOBJ.rank += 1;
          Player.updateCarsAtEnd(playerOBJ.rank);
          playerOBJ.updatePlayerInfo();
          this.showRank();
        }

      }
      //display car srite objects
      drawSprites();
    }
  }

  //function definition to change posn x and y for each player based on the arrows pressed,
  //as soon as the arrows are clicked the same values in DB will change immediately and  then will be
  //updated through play function
  handlePlayerControls() {
    // handling keyboard events
    if (keyIsDown(UP_ARROW)) {
      playerOBJ.positionY += 10;
      playerOBJ.updatePlayerInfo();
      this.playerMoving = true;
      if (keyIsDown(RIGHT_ARROW)) {
        playerOBJ.positionX += 5;
        playerOBJ.updatePlayerInfo();
        this.leftKeyActive = false;
      } else if (keyIsDown(LEFT_ARROW)) {
        playerOBJ.positionX -= 5;
        playerOBJ.updatePlayerInfo();
        this.leftKeyActive = true;
      }
    } else if (keyIsDown(LEFT_ARROW)) {
      playerOBJ.positionX -= 5;
      playerOBJ.updatePlayerInfo();
      this.leftKeyActive = true;
    } else if (keyIsDown(RIGHT_ARROW)) {
      playerOBJ.positionX += 5;
      playerOBJ.updatePlayerInfo();
      this.leftKeyActive = false;
    } 

    if(keyIsDown(DOWN_ARROW)){
      playerOBJ.positionY -= 10;
      playerOBJ.updatePlayerInfo();
      this.playerMoving = true;
    }
  }
  //function to identify if reset button has been clicked
  handleResetButton() {
    this.resetButton.mousePressed(() => {
      databaseOBJ.ref("/").set({
        CARSATEND: 0,
        PLAYERCOUNT: 0,
        GAMESTATE: 0,
        PLAYERS: {},
      });
      window.location.reload();
    });
  }

  showLeaderBoard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);

    //checking info for player 1
    //if-- 1. player1 AND player2 have not won 2. OR player1 has won
    if (
      (players[0].RANK === 0 && players[1].RANK === 0) ||
      players[0].RANK === 1
    ) {
      // &emsp;    This tag is used for displaying four spaces.
      leader1 =
        players[0].RANK +
        "&emsp;" +
        players[0].NAME +
        "&emsp;" +
        players[0].SCORE;

      leader2 =
        players[1].RANK +
        "&emsp;" +
        players[1].NAME +
        "&emsp;" +
        players[1].SCORE;
    }
    // IF player 2 has won
    if (players[1].RANK === 1) {
      leader1 =
        players[1].RANK +
        "&emsp;" +
        players[1].NAME +
        "&emsp;" +
        players[1].SCORE;

      leader2 =
        players[0].RANK +
        "&emsp;" +
        players[0].NAME +
        "&emsp;" +
        players[0].SCORE;
    }
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
  handleFuel(index) {
    //adding fuel once the car hits the fuel pump
    cars[index - 1].overlap(fuelsGroup, function (collector, collected) {
      playerOBJ.fuel += 93;
      if (playerOBJ.fuel > 185) {
        playerOBJ.fuel = 185;
      }
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });

    // Reducing Player car fuel
    if (playerOBJ.fuel > 0 && this.playerMoving) {
      playerOBJ.fuel -= 0.3;
    }

    if (playerOBJ.fuel <= 0) {
      gameState = 2;
      this.gameOver();
    }
  }

  handlePowerCoins(index) {
    cars[index - 1].overlap(powerCoinsGroup, function (collector, collected) {
      playerOBJ.score += 1;
      playerOBJ.updatePlayerInfo();
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });

    if (playerOBJ.score % 10 == 0 && playerOBJ.score > 0) {
      // while carBoosting == true do
      // cars[index - 1].velocity.y += 0.25;
      // wait x wait()
      //5 seconds = wait(5000)
      // car
      // if()
    }
  }

  handleObstacleCollision(index) {
    if (cars[index - 1].collide(obstaclesGroup)) {
      if (this.leftKeyActive) {
        playerOBJ.positionX += 100;
      } else {
        playerOBJ.positionX -= 100;
      }

      //Reducing Player Life
      if (playerOBJ.life > 0) {
        playerOBJ.life -= 185 / 4;
      }

      playerOBJ.updatePlayerInfo();
    }
  }

  handleCarACollisionWithCarB(index) {
    if (index === 1) {
      if (cars[index - 1].collide(cars[1])) {
        if (this.leftKeyActive) {
          playerOBJ.positionX += 100;
        } else {
          playerOBJ.positionX -= 100;
        }

        //Reducing Player Life
        if (playerOBJ.life > 0) {
          playerOBJ.life -= 185 / 4;
        }

        playerOBJ.updatePlayerInfo();
      }
    }
    if (index === 2) {
      if (cars[index - 1].collide(cars[0])) {
        if (this.leftKeyActive) {
          playerOBJ.positionX += 100;
        } else {
          playerOBJ.positionX -= 100;
        }

        //Reducing Player Life
        if (playerOBJ.life > 0) {
          playerOBJ.life -= 185 / 4;
        }

        playerOBJ.updatePlayerInfo();
      }
    }
  }

  showRank() {
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${playerOBJ.rank}`,
      text: "You reached the finish line successfully",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok",
    });
  }

  gameOver() {
    swal({
      title: `Game Over`,
      text: "Oops you lost the race....!!!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks For Playing, refresh to play again",
    });
  }

  end() {
    console.log("Game Over");
  }
}
