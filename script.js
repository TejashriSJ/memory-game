const gameContainer = document.getElementById("game");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow",
  "white",
  "black",
  "pink",
  "gray",
  "skyblue",
  "maroon",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow",
  "white",
  "black",
  "pink",
  "gray",
  "skyblue",
  "maroon",
];

// it returns the same array with values shuffled
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    counter--;
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    newDiv.addEventListener("click", handleCardClick);

    gameContainer.append(newDiv);
  }
  return true;
}

let clickCount = 0;
let score = 0;
let successCount = 0;
let previousBlock = null;
let currentBlock = null;

//set local storage score for first game
if (localStorage.getItem("bestScore") === null) {
  localStorage.setItem(
    "bestScore",
    JSON.stringify({ bestScore: "Not played yet" })
  );
} else {
  //show the best score to player
  let bestScore = JSON.parse(localStorage.getItem("bestScore")).bestScore;
  let bestScoreElement = document.querySelector(".best-score");
  bestScoreElement.innerText = bestScore;
}

// TODO: Implement this function!
function handleCardClick(event) {
  // Change color on click
  event.target.style.background = event.target.getAttribute("class");

  // Restrict to click again the same block
  event.target.style.pointerEvents = "none";

  clickCount += 1;
  score += 1;
  //display the score
  let scoreElement = document.querySelector(".score");
  scoreElement.innerText = score;

  if (clickCount === 2) {
    previousBlock = currentBlock;
    currentBlock = event.target;

    //Restrict to click the other blocks for 1 sec
    event.target.parentElement.style.pointerEvents = "none";

    clickCount = 0;

    if (
      previousBlock.getAttribute("class") !== currentBlock.getAttribute("class")
    ) {
      setTimeout(() => {
        previousBlock.removeAttribute("style");
        currentBlock.removeAttribute("style");

        event.target.parentElement.style.pointerEvents = "auto";
      }, 1000);
    } else {
      previousBlock.style.border = "2px solid green";
      currentBlock.style.border = "2px solid green";
      successCount += 2;

      setTimeout(() => {
        event.target.parentElement.style.pointerEvents = "auto";
      }, 1000);

      //check if match over or not
      if (successCount === COLORS.length) {
        console.log("Score:", score);

        //Store the score if it is better than last score
        let bestScoreObj = JSON.parse(localStorage.getItem("bestScore"));

        if (bestScoreObj.bestScore === "Not played yet") {
          bestScoreObj.bestScore = score;

          localStorage.setItem("bestScore", JSON.stringify(bestScoreObj));
        } else if (bestScoreObj.bestScore > score) {
          bestScoreObj.bestScore = score;

          localStorage.setItem("bestScore", JSON.stringify(bestScoreObj));
        } else {
          scoreElement.innerText = `${score} Not crosed best Score :(`;
        }

        //Reload the game after matching all cards
        let success = document.querySelector(".success-message");
        success.style.display = "block";

        let playAgain = document.querySelector(".play-again");
        playAgain.style.display = "block";
        playAgain.addEventListener("click", (event) => {
          location.reload();
        });

        let restart = document.querySelector(".restart");
        restart.style.display = "none";
      }
    }
  } else {
    currentBlock = event.target;
  }
}
// when the DOM loads
createDivsForColors(shuffledColors);

// load the blocks when the game starts
let start = document.querySelector(".start");
let cards = document.querySelector("#game");
let scoreBoard = document.querySelector(".score-board");
let restart = document.querySelector(".restart");

//On pressign Start button
start.addEventListener("click", (event) => {
  cards.style.display = "block";
  event.target.style.display = "none";
  scoreBoard.style.display = "block";
  restart.style.display = "block";
});

//On pressing restart button
restart.addEventListener("click", (event) => {
  location.reload();
});
