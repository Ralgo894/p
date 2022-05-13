const mainImg = document.querySelector(".mainImg");
const container = document.querySelector(".container");
const title = document.querySelector('.textContainer h1');
const userName = document.querySelector('.textContainer h2');
const tagContainer = document.querySelector('.tagContainer');

var imageIndex = 0;

var works = [];

loadToDB("P_BookmarkData")
.then(e => {
  works = JSON.parse(e).works;
})

document.body.addEventListener("click", () => {
  imageIndex++;
  if (imageIndex >= works.length) imageIndex = 0;

  console.log();

  if (works[imageIndex].illustType != 0) return;

  var baseUrl = works[imageIndex].url.replace(/^.*?(img\/.+?_).*?$/, "https://i.pximg.net/img-original/$1p0");
  var jpg = new Image();
  var png = new Image();

  jpg.addEventListener("load", () => {
    setMainSlide(jpg.src);
  });
  png.addEventListener("load", () => {
    setMainSlide(png.src);
  });

  jpg.src = baseUrl + ".jpg";
  png.src = baseUrl + ".png";
});

function setMainSlide(image) {
  mainImg.src = image;
  container.style.backgroundImage = "url(" + image + ")";

  title.innerHTML = Mikan(works[imageIndex].title);
  adjustTitleWidth();

  userName.textContent = works[imageIndex].userName;

  tagContainer.innerHTML = null;
  for (var i = 0; i < works[imageIndex].tags.length; i++) {
    tagContainer.innerHTML += "<span>#" + works[imageIndex].tags[i] + "</span>"
  }
}

function adjustTitleWidth() {
  document.querySelector(".textContainer>div").style.maxWidth = "40vw";

  var titleWords = document.querySelectorAll('.textContainer h1 span');
  var checkerY = titleWords[0].getBoundingClientRect().y;

  var topLineCount = 0;
  var newWidthList = []

  for (var i = 0; i < titleWords.length; i++) {
    var y = titleWords[i].getBoundingClientRect().y;
    if (checkerY != y) {
      topLineCount++;
      checkerY = y;
    }

    if (!newWidthList[topLineCount]) newWidthList[topLineCount] = 0;
    newWidthList[topLineCount] += titleWords[i].clientWidth;
  }

  if (newWidthList.length != 1) {
    const aryMax = function (a, b) {return Math.max(a, b);}
    let max = newWidthList.reduce(aryMax);
    document.querySelector(".textContainer>div").style.maxWidth = (max + 5) + "px";
  }
}
