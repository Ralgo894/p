function appendScript(URL) {
	var el = document.createElement('script');
	el.src = URL;
	document.body.appendChild(el);
};

function appendCss(URL) {
	var el = document.createElement('link');
	el.href = URL;
	el.rel = 'stylesheet';
	el.type = 'text/css';
	// HEAD要素の最後に追加
	document.getElementsByTagName('head')[0].appendChild(el);
}

appendScript("https://ralgo894.github.io/p/dbStorage.js");
appendScript("https://ralgo894.github.io/p/pGetData/bookmark.js");
