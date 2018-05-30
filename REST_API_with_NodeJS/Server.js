/*Server.js
	Purpose: The Server Implements the REST API that is in the lab2 instructions to manage a 
			 collection of users. 
	What is it and what does it do?
	The server.js is a Node.js app. It will create a sql-lite database and a table called "users".
	The server runs on the localhost and is accessible at port 8085. The server's user table 
	contains the following feilds userid, name, email, and phone. The server itself creates the 
	user table and database. The table database is stored in "api.db". The server refreshes the 
	table at the start of the execution of the application. The server.js uses the Rest API described
	in the instructions to manage the users table.

	
Created by Norman Potts
Lab2 of Web2.0 and PHP frameworks.
*/	


const express = require('express');//Include the express package
const app = express();
const fs = require('fs');
	
	
/// Check for database then create database and table. 
const sqlite3 = require("sqlite3").verbose(); 
var file = 'api.db';																			
/// Check to see if file is in this folder.
fs.access(file, fs.constants.R_OK | fs.constants.W_OK, (err) => {		
	if (!err) {
		console.log('file exists gonna delete.');				
		fs.unlink(file); // Delete api.db
	} else {
		console.log('file does not exist do not delete.');
	}	
	console.log('Continue with creation of database.');
	var db = new sqlite3.Database(file); //gives the connection to the data base, as in opens the file.			
	db.serialize( function() {
		var DROPTableStatement = "DROP TABLE IF EXISTS users;";
		db.run(DROPTableStatement);		
		var CREATETableStatement = "CREATE TABLE users(userid INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, phone TEXT)";
		db.run(CREATETableStatement);
		db.close(); //Closes the database conection
	});										
});
/// Database and table have been replaced.




/// Run the server, and listen for request at 8085.
var server = app.listen(8085, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Listening at http://%s:%s", host, port);
});




/*				Routing				*/

/// When get request get called, get request to /api/ should return a json array of the entire collection.
app.get('/api/', function (request, response) { 		
	console.log("\nGot a GET request for /api/:id");
	var db = new sqlite3.Database(file); /// Gives the connection to the data base, as in opens the file.
	db.serialize(function(){
		var SELECT_all_Statement = "SELECT * FROM users;";			
		db.all(SELECT_all_Statement,[],(err, rows ) => {				
			var jSON_COLLECTION = JSON.stringify(rows);
			var msg = "JSON array of the entire collection: "+jSON_COLLECTION;		
			db.close();		
			response.send(jSON_COLLECTION); 											
		});			
	});	
});// End of app.get
/// End of when get request to /api/ 


/// When get request gets called for /api/:id, should return a json array of the specified user by the Id.
app.get('/api/:id', function(request, response) {
	console.log("\nGot a GET request for /api/:id");
	var id = request.header('jsonInput');	
	var db = new sqlite3.Database(file); /// Gives the connection to the database, as in opens the file.
	var Select_ID_Statement = "SELECT * FROM users WHERE userid = '"+id+"';";	
	db.all(Select_ID_Statement,[],(err, rows ) => {				
		if(err) {
			console.log("Select ID ERROR:"+err.message);
			Succesful = false;	
			response.send("Problem! Could not select from table.")
		} else {
			var jSON_COLLECTION = JSON.stringify(rows);
			var msg = "JSON array of given ID: "+jSON_COLLECTION;		
			db.close(); /// Closes the database connection.
			response.send(jSON_COLLECTION);
		}
	});
});
/// End of when get request for /api/:id.


/// When there is a put request for api, confirm that it contains a valid JSON array representing 
/// a new collection of items. The current collection should be placed with the new collection.
/// The put request should return "REPLACE COLLECTION SUCCESSFUL".
app.put('/api/', function (request, response) {				
	console.log("\nGot a PUT request for /api/"); 
	var inputRecords = request.header('jsonInput'); /// Gets the header jsonInput.
	inputRecords = JSON.parse(inputRecords);		
	var countOfRecords = inputRecords.length;	
	var updateStatement = "";		
	var Succesful = true;		
	var db = new sqlite3.Database(file); 
	db.serialize(function () {			
		for(var i =0; i < countOfRecords; i++) {
			var name = inputRecords[i][0];
			var email = inputRecords[i][1];
			var phone = inputRecords[i][2];
			var id = i+1;			
			updateStatement = "UPDATE users SET name = \""+name+"\", email = \""+email+"\", phone = \""+phone+"\" WHERE userid = "+id+";";						
			try {
				var stmt = db.prepare(updateStatement);
				stmt.run();		
				stmt.finalize();
			} catch(err) 
			{ Succesful = false; }
		}/// End of for loop.												
		var messageback = "";
		if(Succesful == true) 
		{  messageback = "REPLACE COLLECTION SUCCESSFUL";  }
		else
		{  messageback = "Problem! REPLACE COLLECTION was not SUCCESSFUL";  }		
		response.send(messageback);	
	});
	db.close();	
});
/// End of when there is a put request for /api/


/// When server recives a put request for id, confirm it contains valid JSON and upload the record.
app.put('/api/:id', function (request, response) {		
	console.log("\nGot a PUT request for /api/id");
	var inputRecords = request.header('jsonInput'); /// Gets the header jsonInput.
	inputRecords = JSON.parse(inputRecords);
	var name = inputRecords[0];
	var email = inputRecords[1];
	var phone = inputRecords[2];
	var id = inputRecords[3];	
	var messageback = "";
	var updateStatement = "UPDATE users SET name = \""+name+"\", email = \""+email+"\", phone = \""+phone+"\" WHERE userid = "+id+";";	
	var db = new sqlite3.Database(file); 
	db.run( updateStatement, function(err){
		if(err) {
			console.log("    Could not Update");
			messageback = "Could not run PUT id";				
		} else {
			console.log("    Row has been Updated");
			messageback = "UPDATE ITEM SUCCESSFUL";						
		}
		db.close();
		response.send(messageback);	
	});		
});
/// End of when server receives a put API call with id.


/// When a post request gets called to api, it should contain a json object in the request body 
/// representing a new item. The new item should be added to the current collection. The post 
/// request should return "CREATE ENTRY SUCCESSFUL"	 in the body.
app.post('/api/', function (request, response) {
	console.log("\nGot a POST request for /api/ ");	
	var inputRecord = request.header('jsonInput');//Gets the header jsonInput.
	inputRecord = JSON.parse(inputRecord);
	var name = inputRecord[0];
	var email = inputRecord[1];
	var phone = inputRecord[2];	
	var INSERTstatement = "INSERT INTO users ( userid, name, email, phone) values ( null, \""+name+"\", \""+email+"\", \""+phone+"\" )";
	var db = new sqlite3.Database(file); //gives the connection to the data base, as in opens the file.	
	var Succesful;				
	db.run( INSERTstatement, function(err){
		if(err) {
			console.log("ERROR:"+err.message);
			Succesful = false;
		} else {
			console.log("    Row has been inserted");
			Succesful = true;
		}
		db.close(); //Closes the database conection	
		messageback = "";
		if(Succesful == true) {
			messageback = "CREATE ENTRY SUCCESSFUL";			
		} else {
			messageback = "Problem! CREATE ENTRY was not SUCCESSFUL";
		}
		response.send(messageback);
	});								
});
/// End of when server gets a post request call to api.

	
/// When a delete request gets called, delete the entire collection. Return "DELETE COLLECTION SUCCESSFUL".
app.delete('/api/', function (request, response) {      
	console.log("\nGot a DELETE All request for /api/");
	var db = new sqlite3.Database(file); 
	var DeleteStatement = "DELETE FROM users;";
	db.run( DeleteStatement, function(err) {
		if(err) 
		{ console.log("    ERROR:"+err.message);    Succesful = false; }
		else
		{ console.log("    Collection has been deleted");    Succesful = true; }
		db.close();    messageback = "";
		if(Succesful == true) 
		{    messageback = "DELETE COLLECTION SUCCESSFUL";	}
		else 
		{    messageback = "Problem! DELETE COLLECTION was not SUCCESSFUL";    }
		response.send(messageback);			
	});		
});
/// End of when a delete request gets called.


/// When a delete request gets called with id specified, delete the specified user with the id.
app.delete('/api/:id', function (request, response) {      
	console.log("\nGot a DELETE by ID request for /api/:id.");
	var id = request.header('jsonInput');
	var DeleteStatement = "DELETE FROM users WHERE userid = '"+id+"';";
	var db = new sqlite3.Database(file); 
	db.run( DeleteStatement, function(err){
		if(err) 
		{ console.log("    ERROR:"+err.message); Succesful = false; }
		else
		{ console.log("    User record has been deleted"); Succesful = true; }
		db.close(); messageback = "";
		if(Succesful == true)
		{ messageback = "DELETE ITEM SUCCESSFUL"; }
		else
		{ messageback = "Problem! DELETE COLLECTION was not SUCCESSFUL"; }
		response.send(messageback);			
	});	
});
/// En of when a delete request gets called with id specified.


/*			End of	Routing			*/


/* 	End of Server.js
	Created by Norman Potts
	Lab2 of Web2.0 and PHP frameworks.
*/