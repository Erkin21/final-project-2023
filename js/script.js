// Nav Bar
function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}


// Search
function searchGames() {
  let input = document.getElementById("searchInput").value;
  let slideshows = document.querySelectorAll(".slideshow-container");

  for (let i = 0; i < slideshows.length; i++) {
    const gameTitle = slideshows[i]
      .querySelector(".gameTitle")
      .innerText.toLowerCase();
    const gameSummary = slideshows[i]
      .querySelector(".summary")
      .innerText.toLowerCase();
    const shouldDisplay =
      gameTitle.includes(input.toLowerCase()) ||
      gameSummary.includes(input.toLowerCase());

    slideshows[i].style.display = shouldDisplay ? "" : "none";
  }
}

document.getElementById("searchInput").addEventListener("input", searchGames);

