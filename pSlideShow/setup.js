fetch("https://ralgo894.github.io/p/pSlideShow/index.html")
.then(res => res.text())
.then(text  => {
  return new Promise(function(resolve, reject) {
    document.body.innerHTML = text;
    resolve();
  });
})
.then(appendCss.bind(null, "https://ralgo894.github.io/p/pSlideShow/main.css"))
.then(appendScript.bind(null, "https://ralgo894.github.io/p/pSlideShow/mikan.js"))
.then(appendScript.bind(null, "https://ralgo894.github.io/p/pSlideShow/main.js"));
