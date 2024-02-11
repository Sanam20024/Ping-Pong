// Get references to DOM elements
var bar1 = document.getElementById("bar-1");
var bar2 = document.getElementById("bar-2");
var ball = document.getElementById("ball");
// Movement speed of paddles
var movement = 20;

// Constants for bar names and storage keys
const thisBar1 = "Bar-1";
const thisBar2 = "Bar-2";
const storeName = "abc";
const storeScore = 123;

// Variables for game state and data
let whichBar;
let moveX = 2;
let moveY = 2;
let ballMoving;
let border = 12;
let score;
let highScore;
let gameStart = false;

// Initialize high score and last winning bar from local storage
localStorage.setItem(storeScore, "null");
localStorage.setItem(storeScore, "null");
(function () {
  highScore = localStorage.getItem(storeScore);
  whichBar = localStorage.getItem(storeName);
  if (whichBar === "null" || highScore === "null") {
    alert("Hello.. This is your first game");
    highScore = 0;
    whichBar = thisBar1;
  } else {
    alert(whichBar + " has maximum score of " + highScore * 100);
  }
  gameReset(whichBar);
})();

// Reset game state based on the winning bar
function gameReset(barName) {
  bar1.style.left = (window.innerWidth - bar1.offsetWidth) / 2 + "px";
  bar2.style.left = (window.innerWidth - bar2.offsetWidth) / 2 + "px";
  ball.style.left = (window.innerWidth - ball.offsetWidth) / 2 + "px";

  
  // Position ball based on winning bar
  if (barName === thisBar1) {
    ball.style.top =
      bar2.getBoundingClientRect().y -
      bar2.getBoundingClientRect().height +
      "px";
    moveY = -2;
  } else if (barName === thisBar2) {
    ball.style.top = bar1.getBoundingClientRect().height + "px";
    moveY = 2;
  }

  score = 0;
  gameStart = false;
}

// Handle key presses for paddle movement
document.addEventListener("keydown", function (event) {
  if (event.keyCode === 68 || event.keyCode === 39) {
    if (
      parseInt(bar1.style.left, 10) <
      window.innerWidth - bar1.offsetWidth - border
    ) {
      bar1.style.left = parseInt(bar1.style.left, 10) + movement + "px";
      bar2.style.left = bar1.style.left;
    }
  }

    // Move left paddle (Bar-2)
  if (event.keyCode === 65 || event.keyCode === 37) {
    if (parseInt(bar1.style.left, 10) > border) {
      bar1.style.left = parseInt(bar1.style.left, 10) - movement + "px";
      bar2.style.left = bar1.style.left;
    }
  }

   // Start the game on Enter press
  if (event.keyCode === 13) {
    if (!gameStart) {
      gameStart = true;
       // Get ball's position and dimensions
      let ballRect = ball.getBoundingClientRect();
      let ballX = ballRect.x;
      let ballY = ballRect.y;
      let ballDia = ballRect.width;
      
 // Get paddles' heights and widths
      let bar1Height = bar1.offsetHeight;
      let bar2Height = bar2.offsetHeight;
      let bar1Width = bar2.offsetWidth;
      let bar2Width = bar2.offsetWidth;

      // Start continuous ball movement update
      ballMoving = setInterval(function () {
         // Get paddles' current positions
        let bar1X = bar1.getBoundingClientRect().x;
        let bar2X = bar2.getBoundingClientRect().x;

          // Calculate the center of the ball
        let ballCentre = ballX + ballDia / 2;

          // Update ball's position based on current movement
        ballX += moveX;
        ballY += moveY;

          // Update the ball's DOM element position
        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";

        // Check for collisions with screen edges and reverse direction
        if (ballX + ballDia > window.innerWidth || ballX < 0) {
          moveX = -moveX;
        }
 // Check for collision with top paddle (Bar-1)
        if (ballY <= bar1Height) {
          moveY = -moveY;
          score++;

           // If the ball didn't hit the center of the paddle, store the winning bar
          if (ballCentre < bar1X || ballCentre > bar1X + bar1Width) {
            dataStoring(score, thisBar2);
          }
        }
         // Check for collision with bottom paddle (Bar-2)
        if (ballY + ballDia >= window.innerHeight - bar2Height) {
          moveY = -moveY;
          score++;
          
// If the ball didn't hit the center of the paddle, store the winning bar
          if (ballCentre < bar2X || ballCentre > bar2X + bar2Width) {
            dataStoring(score, thisBar1);
          }
        }
      }, 10);// Run the loop every 10 milliseconds
    }
  }
});

// Store game data and display winner information
function dataStoring(scoreObtained, winningBar) {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem(storeName, winningBar);
    localStorage.setItem(storeScore, highScore);
  }
   // Stop the ball movement
  clearInterval(ballMoving);
   // Reset the game for the next round
  gameReset(winningBar);

  // Display an alert with game results
  alert(
    winningBar +
      " wins with score of " +
      scoreObtained * 100 +
      ". Max Score is: " +
      highScore * 100
  );
}
