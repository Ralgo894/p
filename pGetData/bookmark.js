const USER_ID = location.href.match(/\/(\d+)\//)[1];
const DATA = {
  "total": 0,
  "bookmarkTags": {},
  "works": [],
};
let defaultTitle = "";

function main() {
  if (!window.confirm("ダウンロードしますか？")) return;
  getBookmarkData(0, 100)
  .then(mergeData)
  .then(loopGetData)
  .then(saveToLocalStorage)
  .then(() => {
    console.log(DATA);
    alert("完了");
  });
}
main();

function getBookmarkData(offset = 0, limit = 48, tag = "", lang = "ja") {
  return new Promise(function(resolve, reject) {
    if (limit >= 101) limit = 100;

    fetch("https://www.pixiv.net/ajax/user/" + USER_ID + "/illusts/bookmarks?tag=" + tag + "&offset=" + offset + "&limit=" + limit + "&rest=show&lang=" + lang)
      .then(response => response.json())
      .then(responseData => {
        if (responseData.error) reject(false);

        const retData = {
          "total": responseData.body.total,
          "bookmarkTags": responseData.body.bookmarkTags,
          "works": responseData.body.works,
        };
        resolve(retData);
      });
  });
}
function mergeData(data) {
  return new Promise(function(resolve, reject) {
    Object.assign(DATA.bookmarkTags, data.bookmarkTags);
    DATA.works = DATA.works.concat(data.works);
    DATA.total = data.total;

    DATA.works = DATA.works.filter((element, index, self) =>
      self.findIndex(e => e.id === element.id) === index
    );
    resolve(data.total);
  });
}
function loopGetData(total) {
  return new Promise(function(resolve, reject) {
    const maxCount = Math.ceil(total / 100);
    // const maxCount = 5;
    let index = 1;

    const loop = () => {
      changeTitle((index + 1) + '/' + maxCount);
      const offset = 100 * index;

      getBookmarkData(offset, 100)
      .then(mergeData)
      .then(() => {
        index++;

        if (index < maxCount) {
          setTimeout(function () {
            loop();
          }, 10);
        }
        else {
          changeTitle();
          resolve(JSON.stringify(DATA));
        }
      })
    };
    loop();
  });
}
function saveToLocalStorage(dataStr) {
  return new Promise(function(resolve) {
    dbStorage.add('P_BookmarkData', dataStr, resolve);
  });
}

function changeTitle(str = "") {
  const titleElement = document.querySelector("title");
  if (defaultTitle == "") defaultTitle = titleElement.text;
  if(str == "") titleElement.text = defaultTitle;
  else titleElement.text = str;
}
