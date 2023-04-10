const gameContainer = document.getElementById("game");

//Create Gifs
let gifs = [];
function createGifs(count) {
  gifs = new Array(Number(count) / 2).fill(0).map((value, index) => {
    return `${index + 1}.gif`;
  });
  gifs = gifs.concat(gifs);
  return gifs;
}

// it returns the same array with values shuffled
function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

function createDivsForGifs(shuffledGifs) {
  for (let gif of shuffledGifs) {
    const newDiv = document.createElement("div");

    newDiv.classList.add(gif);
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
  return true;
}

let gifsArray;
let shuffledGifs;
function createSpecifiedNUmberOfDivs(cardCount) {
  gifsArray = createGifs(cardCount);
  shuffledGifs = shuffle(gifsArray);
  createDivsForGifs(shuffledGifs);
}

//1.Select the number of cards

let scoreBoard = document.querySelector(".score-board");
let restart = document.querySelector(".restart");
let exit = document.querySelector(".exit");
let menu = document.querySelector(".menu");
let gameLevel = document.querySelector(".game-level");

let cardCount;

gameLevel.addEventListener("click", (event) => {
  gameContainer.style.display = "block";
  scoreBoard.style.display = "block";
  restart.style.display = "block";
  exit.style.display = "block";
  menu.style.display = "none";

  if (event.target.value === "Easy") {
    cardCount = 8;
    createSpecifiedNUmberOfDivs(cardCount);
  } else if (event.target.value === "Medium") {
    cardCount = 16;
    createSpecifiedNUmberOfDivs(cardCount);
  } else {
    cardCount = 24;
    createSpecifiedNUmberOfDivs(cardCount);
  }

  //set local storage score for first game
  if (localStorage.getItem(`bestScore${gifs.length}`) === null) {
    localStorage.setItem(
      `bestScore${gifs.length}`,
      JSON.stringify({ bestScore: " --" })
    );

    document.querySelector(".best-score").innerText = " --";
  } else {
    //show the best score to player
    let bestScore = JSON.parse(
      localStorage.getItem(`bestScore${gifs.length}`)
    ).bestScore;

    document.querySelector(".best-score").innerText = bestScore;
  }
});

let clickCount = 0;
let score = 0;
let successCount = 0;
let previousBlock = null;
let currentBlock = null;

// TODO: Implement this function!
function handleCardClick(event) {
  // Change background to gif on click
  let gif = event.target.getAttribute("class");
  event.target.style.backgroundImage = `url("./gifs/${gif}")`;

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
        //Store the score if it is better than last score
        let bestScoreObj = JSON.parse(
          localStorage.getItem(`bestScore${gifs.length}`)
        );
        let bestScoreElement = document.querySelector(".best-score");

        if (bestScoreObj.bestScore === " --") {
          bestScoreObj.bestScore = score;
          bestScoreElement.innerText = score;

          localStorage.setItem(
            `bestScore${gifs.length}`,
            JSON.stringify(bestScoreObj)
          );
        } else if (bestScoreObj.bestScore > score) {
          bestScoreObj.bestScore = score;
          bestScoreElement.innerText = score;

          scoreElement.innerText = `${score}  : New Best Score :)`;
          localStorage.setItem(
            `bestScore${gifs.length}`,
            JSON.stringify(bestScoreObj)
          );
        } else {
          scoreElement.innerText = `${score}  : Try again to beat the best score :(`;
        }

        let success = document.querySelector(".success-message");
        success.style.display = "block";

        let playAgain = document.querySelector(".play-again");
        playAgain.style.display = "block";

        playAgain.addEventListener("click", (event) => {
          location.reload();
        });

        restart.style.display = "none";
        exit.style.display = "none";
      }
    }
  } else {
    currentBlock = event.target;
  }
}

//On pressing restart button
restart.addEventListener("click", (event) => {
  clickCount = 0;
  score = 0;
  previousBlock = null;
  currentBlock = null;
  document.querySelector(".score").innerText = score;
  gameContainer.innerHTML = "";

  setTimeout(() => {
    gifsArray = createGifs(cardCount);
    shuffledGifs = shuffle(gifsArray);
    createDivsForGifs(shuffledGifs);
  }, 100);
});

// onclick exit
exit.addEventListener("click", () => {
  location.reload();
});

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
    "No network! Please connect to the internet and reload the page";

  cardsBlock.style.display = "none";
  body.appendChild(errorMessage);
}
