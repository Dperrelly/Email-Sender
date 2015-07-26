var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');
var csvFile = fs.readFileSync("friend_list.csv","utf8");

var client = tumblr.createClient({
  consumer_key: 'iPfRZQ1aydTVOykSmpHygaoQQFqo6IMIRpWhKUiZM5Lbj2D5yn',
  consumer_secret: 'JVTYbAznUsog9ALJxA6baNO8czgy4ZRJIcOHbkYXSSzdwO4fPg',
  token: 'gLvwmm6HW5aqqIMxDF4KvZIHjkBkDWC4PZFDAZUDGExS2E90vV',
  token_secret: 'Z3SZyNXi7i4NDb9JJ8mepiyWqhwFpKorMMjR9t60Lkc1f8hlxg'
});

client.posts('briefyouthdreamer.tumblr.com', function(err, blog){
  dateOfPost = new Date(blog.posts[0].date);
  currentDate = new Date();
  console.log(Math.floor((currentDate.getTime() - dateOfPost.getTime()) / 86400000));
})