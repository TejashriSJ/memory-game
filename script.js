const gameContainer = document.getElementById("game");

//Create Gifs
let gifs = [];
function createGifs(count) {
  console.log(count);
  if (!count) {
    count = 8;
  }
  gifs = new Array(Number(count) / 2).fill(0).map((value, index) => {
    return `${index + 1}.gif`;
  });
  gifs = gifs.concat(gifs);
  console.log(gifs);
  return gifs;
}

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

function createDivsForGifs(shuffledGifs) {
  for (let gif of shuffledGifs) {
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    console.log("gif", gif);
    newDiv.classList.add(gif);

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

//To check the internet
window.addEventListener("offline", (event) => {
  detectInternet();
});

function detectInternet() {
  let cardsBlock = document.querySelector("#game");
  let body = document.querySelector("body");
  let errorMessage = document.createElement("p");

  errorMessage.classList = "error";
  errorMessage.innerText =
    "No Network! Please Connect to the internet and restart the game";

  cardsBlock.style.display = "none";
  body.appendChild(errorMessage);
}

// TODO: Implement this function!
function handleCardClick(event) {
  // Change color on click

  let gif = event.target.getAttribute("class");

  event.target.style.background = `url("./gifs/${gif}")`;

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
      if (successCount === gifs.length) {
        console.log("Score:", score);

        //Store the score if it is better than last score
        let bestScoreObj = JSON.parse(
          localStorage.getItem(`bestScore${gifs.length}`)
        );

        if (bestScoreObj.bestScore === "Not played yet") {
          bestScoreObj.bestScore = score;
          console.log("best score Added as 0 -113");
          localStorage.setItem(
            `bestScore${gifs.length}`,
            JSON.stringify(bestScoreObj)
          );
        } else if (bestScoreObj.bestScore > score) {
          bestScoreObj.bestScore = score;
          scoreElement.innerText = `${score}  : New Best Score :)`;
          localStorage.setItem(
            `bestScore${gifs.length}`,
            JSON.stringify(bestScoreObj)
          );
        } else {
          scoreElement.innerText = `${score}  : Not crosed best Score :(`;
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

//1.Select the number of cards
let cardsCount = document.querySelector(".cards-count");

cardsCount.addEventListener("change", (event) => {
  let gifsArray = createGifs(event.target.value);
  let shuffledGifs = shuffle(gifsArray);
  let start = document.querySelector(".start");

  //Start button enabled only after selecting number of cards
  start.style.pointerEvents = "auto";

  createDivsForGifs(shuffledGifs);

  //set local storage score for first game
  if (localStorage.getItem(`bestScore${gifs.length}`) === null) {
    localStorage.setItem(
      `bestScore${gifs.length}`,
      JSON.stringify({ bestScore: "Not played yet" })
    );
    let bestScoreElement = document.querySelector(".best-score");

    bestScoreElement.innerText = "Not played yet";
  } else {
    //show the best score to player
    let bestScore = JSON.parse(
      localStorage.getItem(`bestScore${gifs.length}`)
    ).bestScore;

    let bestScoreElement = document.querySelector(".best-score");

    bestScoreElement.innerText = bestScore;
  }
});

let start = document.querySelector(".start");
let cards = document.querySelector("#game");
let scoreBoard = document.querySelector(".score-board");
let restart = document.querySelector(".restart");
let menu = document.querySelector(".menu");

//On pressign Start button
start.addEventListener("click", (event) => {
  cards.style.display = "block";
  event.target.style.display = "none";
  scoreBoard.style.display = "block";
  restart.style.display = "block";
  menu.style.display = "none";
});

//On pressing restart button
restart.addEventListener("click", (event) => {
  location.reload();
});
