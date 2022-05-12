function appendScript(URL) {
	return new Promise(function(resolve, reject) {
		var el = document.createElement('script');
		el.src = URL;
		document.body.appendChild(el);

		el.addEventListener("load", resolve);
	});
};

function appendCss(URL) {
	return new Promise(function(resolve, reject) {
		var el = document.createElement('link');
		el.href = URL;
		el.rel = 'stylesheet';
		el.type = 'text/css';
		// HEAD要素の最後に追加
		document.getElementsByTagName('head')[0].appendChild(el);
		el.addEventListener("load", resolve);
	});
}

appendScript("https://ralgo894.github.io/p/dbStorage.js")
.then(() => {
	appendScript("https://ralgo894.github.io/p/pGetData/bookmark.js");
});
