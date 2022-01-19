const rp = require("request-promise");
const fs = require("fs");
var cheerio = require("cheerio");
const { post } = require("request");
const textPosts = [];
var serch = 0;
function getPostsHabr(CoutId){
for (var page = 1; page <= CoutId; page++) {
  const url = "https://habr.com/ru/page" + page + "/";
  $ = cheerio.load(url);
  rp(url)
    .then(function (html) {
      //success!
      const whatchCounter = "";
      const postTitle = "";
      var classSerach = ".tm-article-snippet__title-link";
      var classSerachWhatch = ".tm-icon-counter__value";

      const getPost = $(classSerach, html);
      const getWhatch = $(classSerachWhatch, html);
      serch += 1;
      for (var i = 0; i < getPost.length - 1; i++) {
        var getPostHref = "https://habr.com" + getPost[i].attribs.href;
        var namePostHref = getPost[i].attribs.href;
        console.log(getPostHref);
        var chekPostTitle = ".tm-article-snippet__title";
        var chekWhatch = ".tm-icon-counter__value";
        var chekImg = ".tm-article-snippet__lead-image";
        rp(getPostHref)
          .then(function (html) {
            var getTitlePost = $(chekPostTitle, html);
            var getWhatchPosts = $(chekWhatch, html);
            var getImg = $(chekImg, html);
            var titlePost = "title - " + getTitlePost.text();
            var whatchPost = "whatch - " + getWhatchPosts.text();
            var urlPost = "url - " + getPostHref;
            textPosts.push({
              titlePost: getTitlePost.text(),
              whatchPost: getWhatchPosts.text(),
              urlPost: urlPost,
            });

            if (serch == CoutId) {
              console.log("Wrte on file");

              fs.writeFile(
                "./my.json",
                JSON.stringify(textPosts),
                function (err) {
                  if (err) {
                    console.error("Crap happens");
                  }
                }
              );
            }
          })
          .catch(function (err) {
          //  console.log(err);
          });
      }
    })
    .catch(function (err) {
     // console.log(err);
    });
}

}
const express = require("express");

const PORT = process.env.PORT || 3001;
const IP = process.env.IP || "127.0.0.1";
const app = express();
app.get("/api", (req, res) => {
  getPostsHabr(5);
  let rawdata = fs.readFileSync('./my.json');
  let student = JSON.parse(rawdata);
  res.json(student)
})
app.get("/react", (req, res) => {

})
app.listen(PORT, () => {
  console.log(`Server listening on ${IP}:${PORT}`);
});