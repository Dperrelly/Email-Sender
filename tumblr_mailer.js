var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');
var csvFile = fs.readFileSync("friend_list.csv","utf8");
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('2C602o7fFLcILgm5sPM0Tg');
var client = tumblr.createClient({
  consumer_key: 'iPfRZQ1aydTVOykSmpHygaoQQFqo6IMIRpWhKUiZM5Lbj2D5yn',
  consumer_secret: 'JVTYbAznUsog9ALJxA6baNO8czgy4ZRJIcOHbkYXSSzdwO4fPg',
  token: 'gLvwmm6HW5aqqIMxDF4KvZIHjkBkDWC4PZFDAZUDGExS2E90vV',
  token_secret: 'Z3SZyNXi7i4NDb9JJ8mepiyWqhwFpKorMMjR9t60Lkc1f8hlxg'
});

function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
    var message = {
        "html": message_html,
        "subject": subject,
        "from_email": from_email,
        "from_name": from_name,
        "to": [{
                "email": to_email,
                "name": to_name
            }],
        "important": false,
        "track_opens": true,    
        "auto_html": false,
        "preserve_recipients": true,
        "merge": false,
        "tags": [
            "Fullstack_Tumblrmailer_Workshop"
        ]    
    };
    var async = false;
    var ip_pool = "Main Pool";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        //console.log(message);
        //console.log(result);   
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
 }

function csvParse(csvStr){
	var friends = [];
	var lines = csvStr.split('\n');
	var peopleArray = lines.map(function(personStr){
		return personStr.split(',');
	});
	var keys = peopleArray[0];
	for(var i = 1; i < peopleArray.length; i++){
		var personObj = {};
		for(var j = 0; j < keys.length; j++){
			personObj[keys[j]] = peopleArray[i][j];
		}
		friends.push(personObj);
	}
	return friends;
}

var friendList = csvParse(csvFile);
var emailTemplate = fs.readFileSync("email_template.html", "utf8");
var latestPosts = [];

client.posts('briefyouthdreamer.tumblr.com', function(err, blog){
	var currentDate = new Date();
	for(var i = 0; i < blog.posts.length; i++){
		var dateOfPost = new Date(blog.posts[i].date);
		if(Math.floor((currentDate.getTime() - dateOfPost.getTime()) / 86400000) < 28){
			latestPosts.push(blog.posts[i]);
		}
	}
	friendList.forEach(function(friend){
		var firstName = friend["firstName"];
		var numMonthsSinceContact = friend["numMonthsSinceContact"];
		var customizedTemplate = ejs.render(emailTemplate, 
			{ firstName: firstName,  
			  numMonthsSinceContact: numMonthsSinceContact,
			  latestPosts: latestPosts
			});
		sendEmail(friend["firstName"] + friend["lastName"], friend["emailAddress"], "Daniel Perrelly", "danperrelly@gmail.com", "Tumblr!", customizedTemplate); 
	});
})

