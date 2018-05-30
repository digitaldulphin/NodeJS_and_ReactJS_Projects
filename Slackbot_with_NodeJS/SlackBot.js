/**	
	Web 2.0 and PHP frameworks 
	Lab 3 Slackbot.js
	Created by Norman Potts	
	Code had been written in a condensed manor.
	
	Purpose: This file logs into the given a slackbot account and a yelp API account. I uses the 
			 API to answer question asked in the slack chat. Questions are already determined, from
			 a given set specified in the instructions for this lab. Questions are about local 
			 restaurants and the answers are delivered to the slack chat by the slack bot's account.
			 There are seven types of questions that the slack bot is configured to respond with.
			 They are:
				1. Nearby Address
				2. Close by Longitude Latitude
				3. Top X number Address
				4. Closest X number Address
				5. Find Me Category Address
				6. Reviews Restaurant Name Address
				7. Search By Phone Phone Number



	Information need to access yelp API and slack account.
	API token: xoxb-260030680646-jJ8Lx5u3hjns9XhVdvWlwrPN 
	Work space url: https://web20workspace.slack.com/messages/C7M55MPPE/convo/C7M55MPPE-1508462984.000005/ 
	Email: storminnormanpotts@hotmail.com 
	Slackbot password: tuv221lSF 
	yelp Client ID:lMDxVj0RBVy7Ibx_a6MGAw 
	yelp secret: Dybv5zC5sgKvCV9aKMM4abxwQfn9X470GVzlEvNIqdgWvLdaiDk66U9B2elZoD90 
	Yelp password: passwrdpassw0rd! 
*/
const http = require('http');						
var Bot = require('slackbots');		
var mysettings = { token: 'xoxb-260030680646-jJ8Lx5u3hjns9XhVdvWlwrPN', name: 'yelphelp' };
var bot = new Bot(mysettings);				
var bot_ID;
var bot_name  = "yelphelp";

/// When slackbot starts up, write to chat saying its ready.
bot.on( 'start', function() {							
		bot.postMessageToChannel('general', 'Hello I am bot YelpHelp. Ready for commands.');
		console.log("Bot is ready.");
		determineBotID();		
	});
/// End of when slackbot starts up.
		
		
/// Function determineBotID()
///	 Purpose: sets bot_ID of yelp help bot.
function determineBotID() {			
	var usersdata = bot.getUsers(); 
	var users = usersdata["_value"]["members"];
	var usersCount = users.length;							
	/// Determine bot_id of yelp help bot.
	for( var i = 0; i < usersCount; i++)
	{	if ( bot_name == users[i]["name"])
		{	bot_ID = users[i]["profile"]["bot_id"];	}
	}			
}/// End of function determineBotID 
		

///	when a message appears on slack chat, determine how bot should respond.
bot.on('message', function(data) {						
		determineBotID(); 					
		var dataText = data.text;		
		/// Determine if message is from bot, or from a user, or neither.
		if( data.type = "message" ) {
			if( data.bot_id != bot_ID ) {					
				if( dataText != null ) {											
					console.log("Message from not yelphelp: "+dataText );
					console.log("Which Command???");
					var commandNumber = determineIFCommandAndWhichCommand(dataText);										
					switch(commandNumber) {
						case 0:
							console.log("    Not a Command.");
							break;
						case 1:								
							Command_NearbyAddress(dataText);
							break;
						case 2:								
							Command_ClosebyLongitudeLatitude(dataText);
							break;
						case 3:								
							Command_TopXnumberAddress(dataText);
							break;
						case 4:								
							Command_ClosetXnumberAddress(dataText);
							break;
						case 5:								
							Command_FindMeCategoryAddress(dataText);
							break;							
						case 6:								
							Command_ReviewsRestaurantNameAddress(dataText);
							break;							
						case 7:								
							Command_SearchByPhoneNumber(dataText);
							break;
						default:
							console.log("    Not a Command.");
}}}}});	
/// End of when a message appears in slack.
	
	
/// Function determineIFCommandAndWhichCommand
///		Purpose: Determines if text is a command and then which command. Made this a separate
///  			 function in case I wanted to make the logic more specific. Returns commandNumber;
function determineIFCommandAndWhichCommand(messagetext) {
/*Commands
	Nearby Address - 					Example usage: Nearby 161 East Avenue, Brantford, Ontario
	Closeby Longitude Latitude -		Example usage: Closeby 80.264425W 43.139387N
	Top Xnumber Address -               Example usage: Top 9 161 East Avenue, Brantford, Ontario
	Closest Xnumber Address -           Example usage: Closest 5 161 East Avenue, Brantford, Ontario
	FindMe Category Address -           Example usage: FindMe Coffee 161 East Avenue, Brantford, Ontario
	Reviews RestaurantName Address -    Example usage: Reviews Wingmaster 70 Erie Avenue Brantford, ON N3S 2E8 Canada
	SearchByPhone PhoneNumber -         Example usage: SearchByPhone 19055220088
*/	
	messageArray =  messagetext.split(" ");	
	if(messageArray[0] == "Nearby") 
	{ commandNumber = 1; }
	else if (messageArray[0] == "Closeby")
	{ commandNumber = 2; }
	else if(messageArray[0] == "Top")
	{ commandNumber = 3; }
	else if(messageArray[0] == "Closest")
	{ commandNumber = 4; }
	else if(messageArray[0] == "FindMe")
	{ commandNumber = 5; }			
	else if(messageArray[0] == "Reviews")
	{ commandNumber = 6; }		
	else if(messageArray[0] == "SearchByPhone")
	{ commandNumber = 7; }
	else
	{ commandNumber = 0; }						
	return commandNumber;	
}/// End of function determineIFCommandAndWhichCommand.
	
	
/// Function Command_NearbyAddress
///		Purpose: List the name and address of 5 near by restaurants within 10 000m. Output is neatly 
/// 	formatted from the slack bot. If no restaurants are found within the radius of the address 
/// 	is found slack bot out put should be "No near by address found.". 
///		Example address( Nearby 135 Fennel Avenue West, Hamilton, Ontario )
///return list ready to be displayed
function Command_NearbyAddress( messageText ) {
	console.log("    Command_NearbyAddress.");
	var messageArray = messageText.split(" ");
	var address = "";		
	for( i = 1; i < messageArray.length; i++)
	{ address += " "+messageArray[i]; }
	//Setup the request parameters. 
	var myreq = { 'location' : address, 'radius' : 10000, 'limit' : '5', };	
	Yelp( myreq, 1 ).then(function(Results) {
		console.log("NearBy Results:");					
		var output = "";
		var countOfBuisness = 0;
		try {
			countOfBuisness = Results.businesses.length;
		} catch(e) {
			console.log("Yelp Error: could not find businesses")			
			countOfBuisness = -1;
		}								
		if (countOfBuisness == 0)
		{ output	+= "No near by restaurants found."; }
		else if ( countOfBuisness == -1) {
			output += "Yelp had an error.\n";
			output += Results.error.description;			
		} else {
			output += "Here are five near-by restaurants within 10,000m of "+address+".\n\n";
			for(var i=0; i < countOfBuisness; i++ ) {					
				var xi = i + 1;
				var businesse = Results.businesses[i].name;
				var Baddress = Results.businesses[i].location["display_address"];
				var adr = "";
				for(var m=0; m < Baddress.length; m++)
				{ adr += Baddress[m]+" "; }				
				output += "\n"+xi+". "+businesse+" \n       "+" Address: "+adr+" \n";
}}
		bot.postMessageToChannel('general', output);		
}); }
/// End of Command_NearbyAddress 
	
	
/// Function Command_ClosebyLongitudeLatitude
///		Purpose: List the name and address of any 5 closeby restaurants ina neatly formatted 
///		way. Closeby restaurants are within 10 000m radius of the provided longitude and 
///		latitude position. If no close by restaurants can be found output should be "No closeby
///		restarunts can be found."  Example: Closeby 79.8861W 43.2383N
function Command_ClosebyLongitudeLatitude( messageText ) {
	console.log("    Command_ClosebyLongitudeLatitude.");
	var messageArray = messageText.split(" ");
	var longitude; var latitude; var itemOne; var itemTwo; var output = "";	
	if( messageArray.length != 3 ) {
		output += "Not the correct number of arguments for closeby command to work."
	} else {
		itemOne = messageArray[1]; itemTwo = messageArray[2];
		var inncorectParameters = false;
		for(var stm = 1; stm <= 2; stm++) {
			var item = messageArray[stm]; var itemArr = item.split(''); var itemlength = itemArr.length;
			var lc = itemArr[itemlength-1]; var digits = parseFloat(item);			
			if (digits == "NaN" || ( lc != "S" && lc != "N" && lc != "E" && lc != "W" && lc != "s" && lc != "n" && lc != "e" && lc != "w") ) {
				output = "Parameters had inncorect format.";
				break;
			} else {					
				if( lc == "S" || lc == "s" )
				{ latitude = 0 - digits; } 
				else if ( lc == "N" || lc =="n") 
				{ latitude = digits; }
				else if (  lc == "e" || lc == "E")
				{ longitude = digits; }
				else if (  lc == "W" || lc == "w")
				{ longitude = 0 - digits; }										
			}								
		}
		if (latitude == null || longitude == null) {
			output = "Parameters had inncorect format.";
			bot.postMessageToChannel('general', output);
		} else {						
			//Setup the request parameters. 
			var myreq = { 'latitude' : latitude, 'longitude': longitude, 'radius' : 10000, 'limit' : '5', };			
			Yelp( myreq, 1 ).then(function(Results) {									
				console.log("Closeby long lat data:");				
				var countOfBuisness = 0;
				try {
					countOfBuisness = Results.businesses.length;
				} catch(e) {
					console.log("Yelp Error: could not find businesses")						
					countOfBuisness = -1;
				}										
				if(countOfBuisness == 0) 
				{ output	+= "No closeby restarunts can be found." }
				else if ( countOfBuisness == -1) {
					output += "Yelp had an error.\n";
					output += Results.error.description;					
				} else {
					output += "Here are five close by restarunts within 10,000m of Longitude: "+longitude+", and Latitude: "+latitude+"\n\n";
					for(var i=0; i < countOfBuisness; i++ ) {							
						var xi = i + 1;
						var businesse = Results.businesses[i].name;
						var Baddress = Results.businesses[i].location["display_address"];
						var adr = "";
						for(var m=0; m < Baddress.length; m++) 
						{ adr += Baddress[m]+" "; }				
						output += "\n"+xi+". "+businesse+" \n       "+" Address: "+adr+" \n";
				}}
				bot.postMessageToChannel('general', output);
}); } } }
/// End of Command_ClosebyLongitudeLatitude 
	
		
/// Function Command_TopXnumberAddress
///		Purpose: List the name and address of the top x number nearby restarunts in a neatly 
///		formatted way, where the "top" restaurants have the highest yelp rating. Must be within
///		10 000M of provided address. If no address can be found  out put should be "No nearby 
///		restaurunts can be found." If less than x number of restaurants can be found, they
///		should still be displayed. Example input: Top 10 135 Fennel Avenue West, Hamilton, Ontario. 
function Command_TopXnumberAddress( messageText ) {
	console.log("    Command_TopXnumberAddress.");
	var messageArray = messageText.split(" "); var address = ""; var X = messageArray[1];
	for( i = 2; i < messageArray.length; i++) 
	{ address += " "+messageArray[i]; } 
	var listNameandAddresses;	
	//Setup the request parameters. 
	var myreq = { 'location' : address, 'radius' : 10000, 'limit' : X, 'sortby' : 'rating', };
	Yelp( myreq, 1 ).then(function(Results) {
		console.log("Top X Number Results:");					
		var output = ""; var countOfBuisness = 0;
		try {
			countOfBuisness = Results.businesses.length;
		} catch(e)
		{ countOfBuisness = -1; }								
		if(countOfBuisness == 0) 
		{ output += "No nearby restaurunts can be found."; }
		else if ( countOfBuisness == -1) {
			output += "Yelp had an error.\n";
			output += Results.error.description;			
		} else {
			output += "Here are the Top "+X+" restarunts within 10,000m of "+address+".\n\n";
			for(var i=0; i < countOfBuisness; i++ ) {	
				var xi = i + 1; var businesse = Results.businesses[i].name;
				var Baddress = Results.businesses[i].location["display_address"]; var adr = "";
				for(var m=0; m < Baddress.length; m++)
				{ adr += Baddress[m]+" "; }				
				output += "\n"+xi+". "+businesse+" \n       "+" Address: "+adr+" \n";
}}
		bot.postMessageToChannel('general', output);		
});}
/// End of Command_TopXnumberAddress.
			
	
/// Function Command_ClosetXnumberAddress
///		Purpose: list the name and address of closes x number of restarunts.
///		If no restaurants nearby, print "No nearby restaurants can be found."
///		If less than X number of closest restarunts can be found they still should be displayed.
///		Example format: Closet 7  135 Fennel Avenue West, Hamilton, Ontario 
function Command_ClosetXnumberAddress( messageText ) {
	console.log("    Command_ClosetXnumberAddress");
	var messageArray = messageText.split(" "); var address = ""; var X = messageArray[1];
	for( i = 2; i < messageArray.length; i++)
	{ address += " "+messageArray[i]; }
	var listNameandAddresses;	
	//Setup the request parameters. 
	var myreq = { 'location' : address, 'radius' : 10000, 'limit' : X, 'sortby' : 'distance', };	
	Yelp( myreq, 1 ).then(function(Results) {
		console.log("Closest X Number Results:");			
		var output = ""; var countOfBuisness = 0;
		try {
			countOfBuisness = Results.businesses.length;
		} catch(e) 
		{ countOfBuisness = -1; }								
		if(countOfBuisness == 0) {		
			output	+= "No nearby restaurunts can be found.";
		} else if ( countOfBuisness == -1) {
			output += "Yelp had an error.\n";
			output += Results.error.description;			
		} else {
			output += "Here are the Closest "+X+" restarunts within 10,000m of "+address+".\n\n";
			for(var i=0; i < countOfBuisness; i++ ) {					
				var xi = i + 1; var businesse = Results.businesses[i].name;
				var Baddress = Results.businesses[i].location["display_address"]; var adr = "";
				for(var m=0; m < Baddress.length; m++) 
				{ adr += Baddress[m]+" "; }				
				output += "\n"+xi+". "+businesse+" \n       "+" Address: "+adr+" \n";
}}
		bot.postMessageToChannel('general', output);			
});	}
/// End of Command_ClosetXnumberAddress.
				
	
/// Function Command_FindMeCategoryAddress
///		Purpose: return the name address and rating of any restaurant matching the category 
///		given that is within 20,000 meters of the given address. The category given should 
///		correspond to the alias field of the businesses search responses, for example "coffee",
///		"sushi" or "sefood." If no near bby restarunts with the provided category output "No 
///		category restaurants can be found." where category is provided category. EX"No sushi..."
///		Example format: FindMe sushi 135 Fennel Avenue West, Hamilton Ontario.
function Command_FindMeCategoryAddress( messageText ) {
	console.log("    Command_FindMeCategoryAddress.");
	var messageArray = messageText.split(" "); var address = ""; var Category = messageArray[1];
	for( i = 2; i < messageArray.length; i++)
	{ address += " "+messageArray[i]; }		
	/// Setup the request parameters. 
	var myreq = { 'location' : address, 'radius' : 20000, 'categories' : Category, };	
	Yelp( myreq, 1 ).then(function(Results) {
		var output = ""; var countOfBuisness = 0;
		try {
			countOfBuisness = Results.businesses.length;
		} catch(e)
		{ countOfBuisness = -1; }								
		if(countOfBuisness == 0)
		{ output	+= "No category restaurants can be found."; }
		else if ( countOfBuisness == -1) {
			output += "Yelp had an error.\n";
			output += Results.error.description;
		} else {
			output += "Here are "+Category+" restarunts within 20,000m of "+address+"\n\n";
			for(var i=0; i < countOfBuisness; i++ ) {					
				var xi = i + 1;
				var businesse = Results.businesses[i].name;
				var Baddress = Results.businesses[i].location["display_address"];
				var adr = "";
				for(var m=0; m < Baddress.length; m++)
				{ adr += Baddress[m]+" "; }				
				output += "\n"+xi+". "+businesse+" \n       "+" Address: "+adr+" \n";
}}
		bot.postMessageToChannel('general', output);
});	}
/// End of Command_FindMeCategoryAddress 
		
		
function isNumeric(str) {
	var pattern = new RegExp("[0-9]");
	var hasNumber = pattern.test(str);
	return hasNumber;
}
	
	
/** Function Command_ReviewsRestaurantNameAddress
		Purpose: Should return the review,  Excerpt text, reviewer username,  rating,  and link to	
		the full review, for three reviews of the restaurant with the name RestaurantName closest to
		the supplied Address. If no nearby restaurants with the provided name can be  found, the 
		slack bot should output "'RestaurantName' cannout be found'".
		Example format: Reviews Spring Sushi 135 Fennel Avenue West, Hamilton, Ontario      */
function Command_ReviewsRestaurantNameAddress( messageText ) {
	console.log("    Command_ReviewsRestaurantNameAddress");
	var messageArray = messageText.split(" "); var address = ""; var RestaurantName =""; var startAddress = false;
	for( i = 1; i < messageArray.length; i++) {
		if(startAddress == false) { 		
			var str = messageArray[i];							
			if ( isNumeric(str) ) 
			{  startAddress = true; address += " "+messageArray[i]; }
			else 
			{ RestaurantName +=" "+messageArray[i]; }
		} else 
		{ address += " "+messageArray[i]; }			
	}
	//Setup the request parameters. 
	var myreq = { 'location' : address, 'term' : RestaurantName, };
	Yelp( myreq, 1 ).then(function(Results) {
		var output = "";  var countOfBuisness = 0;
		try {
			countOfBuisness = Results.businesses.length;
		} catch(e) 
		{ countOfBuisness = -1; }						
		if(countOfBuisness == 0)
		{ output	+= RestaurantName+" cannot be found."; }
		else if ( countOfBuisness == -1) {
			output += "Yelp had an error.\n";
			output += Results.error.description;
		} else {									
			var businessID = Results.businesses[0].id;		
			Yelp( businessID, 2 ).then(function(Results) {
				output += "Three Reviews for "+RestaurantName+"\n\n";		
				var countreviews = Results.reviews.length;			
				if(countreviews == 0)
				{ output += "There are no reviews for this buisness."; }
				else {
					if(countreviews > 3)
					{	countreviews = 3; }										
						for( r = 0; r < countreviews; r++) {												
							var Excerpttext = Results.reviews[r].text;
							var username = Results.reviews[r].user["name"];
							var rating = Results.reviews[r].rating;
							var rurl = Results.reviews[r].url;							
							output += "\n\nReveiw From: "+username+"\n";
							output += "Rating:  "+rating+"\n";
							output += "Comment:  "+Excerpttext+"";							
							output += "\nUrl: "+rurl+" \n";
						} }	
					bot.postMessageToChannel('general', output);							
				}); }
		bot.postMessageToChannel('general', output);			
	});	}
/// End of Command_ReviewsRestaurantNameAddress 
				
	
/** Function Command_SearchByPhoneNumber
		Purpose: return the name and address of any restaurant found with the supplied phone 
		number PhoneNumber. If no restaurant with the provided phone number can be found,
		should output "No restaurants with phone number 'Phone Number can be found." 
		Example format: SearchByPhone 517 832 3232 */
function Command_SearchByPhoneNumber( messageText ) {	
	var messageArray = messageText.split(" ");  var phone = "";		
	for( i = 1; i < messageArray.length; i++)
	{ phone += ""+messageArray[i]; }	
	var phoneArr = phone.split(''); phone = "+";
	/// Take out non digits..
	for(var j = 0;  j < phoneArr.length; j++ ) {
		if( phoneArr[j] == "|") 
		{ break; }
		else {
			var a = isNumeric(phoneArr[j]);
			if (a == true) 
			{ phone += phoneArr[j]; }	
		}
	}	
	// Set up the request parameters. 
	var myreq = { 'phone' : phone, };	
	Yelp( myreq, 3 ).then(function(Results) {			
		var output = "";
		if( Results.businesses.length == 0)
		{ output += "No restaurant with phone number "+phone+"can be found."; }
		else {											
			var name  = Results.businesses[0].name;
			var address = Results.businesses[0].location["display_address"];			
			output += "A Restaurant with phone number:  "+phone+"\n";
			output += " "+name+"\n";
			output += " Address:   "+address+" \n" 
		}		
		bot.postMessageToChannel('general', output);					
	}); }
/// End of Command_SearchByPhoneNumber 
			

/**	Function Yelp()	
	Purpose: Access yelp's API.	
	parameters: myreq, SearchType 
			myreq is the paramets for the yelp search.
			SearchType is the type of search, buisness search, phone search, reviews search.	
	Code Source: elearn.
	Code Modificaitons: Changed comments, placed keys in, other small changes.
*/
function Yelp( myreq, SearchType ) {
	return new Promise(function(resolve, reject) {		
		var TheYelpData = 2; //Will hold the returned yelp data.		
		var https = require('https'); var querystring = require('query-string');		
		/// Function testfunc
		/// 	Uses the access_token to make a request the YELP API.	
		function testfunc(access_token) {			
			/// Strinigy the request parameters.
			var myreqstr = querystring.stringify(myreq);
			//Business search.
			var optionsOne = {
				host: 'api.yelp.com',
				port: '443',
				path: '/v3/businesses/search?' + myreqstr, // include the URL parameters
				method: 'get',
				headers : { 'Authorization' : 'Bearer ' + access_token, }
			};			
			//Reviews search.
			var optionsTwo = {
				host: 'api.yelp.com',
				port: '443',
				path: '/v3/businesses/' + myreq+'/reviews', // include the URL parameters
				method: 'get',
				headers : { 'Authorization' : 'Bearer ' + access_token, }
			};			
			//Phone search.
			var optionsThree = {
				host: 'api.yelp.com',
				port: '443',
				path: '/v3/businesses/search/phone?'+myreqstr, // include the URL parameters
				method: 'get',
				headers : { 'Authorization' : 'Bearer ' + access_token, }
			};		
			var options;			
			if ( SearchType  == 1 ) 
			{ options = optionsOne; }
			else if (SearchType  == 2)
			{ options = optionsTwo; }
			else if(SearchType == 3)
			{ options = optionsThree; }		
			mycallback = function(response) {
				var str = '';
				//Append chunk of data to str.
				response.on('data', function (chunk) { str += chunk; });
				//Response has been recived so print it out here.
				response.on('end', function () {					
					results = JSON.parse(str);//<---Yelp Results
					resolve(results);			
				});
			}							
			//Make request.
			var newreq = https.request(options, mycallback).end();  
		}/// End of function testfunc 		
		/// Use client ID and client_secret to obtain access_token for yelp API. 
		callback = function(response) {
			var str = '';
			/// Another chunk of data has been received, so append it to `str`
			response.on('data', function (chunk) { str += chunk; });
			/// The whole response has been received, so we just print it out here
			response.on('end', function () {
				var tokens = JSON.parse(str);
				/// Once we have the access token, make a request to the API
				testfunc(tokens.access_token);
			});								
		}
		/// Set up request with App id, App secret.
		var authreq = {
			'grant_type' : "client_credentials",
			'client_id' : "lMDxVj0RBVy7Ibx_a6MGAw", 
			'client_secret' : "Dybv5zC5sgKvCV9aKMM4abxwQfn9X470GVzlEvNIqdgWvLdaiDk66U9B2elZoD90" 
		};
		var authreqstr = querystring.stringify( authreq );
		var authoptions = {
			host: 'api.yelp.com',
			port: '443',
			path: '/oauth2/token',
			method: 'POST',
			headers: {
				'Content-Type':'application/x-www-form-urlencoded',
				'Content-Length' : Buffer.byteLength(authreqstr)      
			}   
		};
		var req = https.request(authoptions, callback);
		req.write(authreqstr);
		req.end();		
});	}
/// End of function Yelp 

