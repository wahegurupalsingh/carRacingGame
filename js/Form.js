/*
  ●  Form should contain the input box and a button to log in.
  ●  When the button is pressed, the player's name should be registered in the database 
  and a new player should be created.
*/

/*

The body of an HTML page can contain several different types of elements-
- h1, h2, h3, h4, h5, h6: display headings of different scales.
- input: to collect input from the user. INPUT BOX
- button: to display a button. and perform update on click.
This model of an HTML page is called Document object Model (or DOM).
We will be using the p5 Dom library to create the formOBJ.

*/

/*
-> databaseReference = dbobject.ref() is used to refer to the location of the database 
value(field) we care about.

-> databaseReference.on() creates a listener which keeps listening to the
gameState from the database. When the gameState is changed in
the database, the function passed as an argument to it is executed.
Note: Here the function is directly written inside the .on() listener.

-> databaseReference.set() is used to set the value in the database.

-> databaseReference.update() will update the database reference.
Here "/" refers to the main database inside which gameState is created.


*/

class Form {
  constructor() {
    this.inputBox = createInput("").attribute(
      "placeholder",
      "Please enter your game name"
    );
    this.playButton = createButton("PLAY");
    this.titleIMG = createImg("./assets/title.png", "game title");
    this.greetingMSG = createElement("h2");
  }

  setElementsPosition() {
    this.titleIMG.position(120, 50);
    this.inputBox.position(width / 2 - 110, height / 2 - 80);
    this.playButton.position(width / 2 - 90, height / 2 - 20);
    this.greetingMSG.position(width / 2 - 300, height / 2 - 100);
  }

  setElementsStyle() {
    this.titleIMG.class("gameTitle");
    this.inputBox.class("customInput");
    this.playButton.class("customButton");
    this.greetingMSG.class("greeting");
  }

  hide() {
    this.greetingMSG.hide();
    this.playButton.hide();
    this.inputBox.hide();
  }

  handleMousePressed() {
    /*
      play.mousePressed() will update fields in database as follows:
      --playerCount by 1 each time play button is clicked.
      --playerOBJ records with 
        INDEX with the sequence of the play button is clicked
        NAME  with the added input as name 
        DISTANCE as 0(ZERO) at the start of the program
  
      button.mousePressed() can be used to trigger an action when a mouse button is pressed. 
      It expects a function as an argument. The code to display a greeting and update the 
      database when button is pressed.

      Arrow functions bind the function to the original object here, we have it as component 
      which calls it.
      Here mousePressed is called inside the display function which is called by
      the formOBJ object. 
     
      ()=> Arrow function ensures that 'this.property' remains bound to
      the formOBJ object.
    */
    this.playButton.mousePressed(() => {
      this.inputBox.hide();
      this.playButton.hide();

      var message = `Hello ${this.inputBox.value()}</br> waiting for another player to join...`;
      this.greetingMSG.html(message);

      playerCount += 1;
      playerOBJ.index = playerCount;
      playerOBJ.name = this.inputBox.value();

      playerOBJ.addPlayer(); 
      /*
      function call to change existing value of playerCount to a new one based on the 
      value of paramter passed in the database
      */
      playerOBJ.updateCount(playerCount);
      playerOBJ.getDistance();
    });
  }

  display() {
    this.setElementsPosition();
    this.setElementsStyle();
    this.handleMousePressed();
  }
}


// formOBJ = new Form();
// formOBJ.display();
