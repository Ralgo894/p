
function loadScript() {
	return Promise.resolve()
	.then(appendScript.bind(null, "https://ralgo894.github.io/p/dbStorage.js"))
	.then(appendScript.bind(null, "https://ralgo894.github.io/p/pGetData/bookmark.js"));
	.then(appendScript.bind(null, "https://ralgo894.github.io/p/pSlideShow/setup.js"));
}
loadScript();

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
