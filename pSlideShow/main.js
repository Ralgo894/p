var mainImg = document.querySelector(".mainImg");
var container = document.querySelector(".container");
var title = document.querySelector('.textContainer h1');
var userName = document.querySelector('.textContainer h2');
var tagContainer = document.querySelector('.tagContainer');

var imageIndex = 6;

var works = [];

loadToDB("P_BookmarkData")
.then(e => {
  works = JSON.parse(e).works;
})

document.body.addEventListener("click", () => {
  imageIndex++;
  if (imageIndex >= works.length) imageIndex = 0;

  if (works.illustType != 0) return;

  var baseUrl = works[imageIndex].url.replace(/^.*?(img\/\d{4}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d+).*?$/, "https://i.pximg.net/img-original/$1_p0");
  var jpg = new Image();
  var png = new Image();
  jpg.src = baseUrl + ".jpg";
  png.src = baseUrl + ".png";

  jpg.addEventListener("load", () => {
    setMainImage(jpg.src);
  });
  png.addEventListener("load", () => {
    setMainImage(png.src);
  });
});

function setMainImage(image) {
  var imageName = image;
  mainImg.src = imageName;
  container.style.backgroundImage = "url(" + imageName + ")";

  title.innerHTML = Mikan(works[imageIndex].title);
  moveTitle();

  userName.textContent = works[imageIndex].userName;

  tagContainer.innerHTML = null;
  for (var i = 0; i < works[imageIndex].tags.length; i++) {
    tagContainer.innerHTML += "<span>#" + Mikan(works[imageIndex].tags[i]) + "</span>"
  }
}

function moveTitle() {
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
    document.querySelector(".textContainer>div").style.maxWidth = (max + 1) + "px";
  }
}
