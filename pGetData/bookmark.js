// aa
const USER_ID = location.href.match(/\/(\d+)\//)[1];
const DATA = {
  "bookmarkTags": {},
  "works": [],
};

function main() {
  getBookmarkData()
  .then(mergeData)
  .then(() => {
    console.log(DATA);
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

    DATA.works = DATA.works.filter((element, index, self) =>
      self.findIndex(e => e.id === element.id) === index
    );
    resolve();
  });
}
function loopGetData() {

}
