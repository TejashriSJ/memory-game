const gameContainer = document.getElementById("game");
const openedBlocks = { block1: null, block2: null };

//storign colors in local storage
localStorage.setItem("openedBlocks", JSON.stringify(openedBlocks));

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

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on

    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}
let clickCount = 0;
let successCount = 0;
let previousBlock = null;
let currentBlock = null;

// TODO: Implement this function!
function handleCardClick(event) {
  // Change color on click
  event.target.style.background = event.target.getAttribute("class");

  // Restrict to click again the same block
  event.target.style.pointerEvents = "none";

  clickCount += 1;

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
      if (successCount === COLORS.length) {
        //Reload the game after matching all cards
        let success = document.querySelector(".success-message");
        success.style.display = "block";
        setTimeout(() => {
          location.reload();
        }, 4000);
      }
    }
  } else {
    currentBlock = event.target;
  }
}

// when the DOM loads
createDivsForColors(shuffledColors);
