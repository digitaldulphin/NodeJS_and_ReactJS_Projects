console.log(" Start server.js for Fernlea Flowers todo app. ");
/**	server.js
	Created by Norman Potts.
	The backend of the To do list app for Fernlea Flowers  competency test.
	This javascript file uses NodeJS to implement a web server.
	This server requires NodeJS to be installed on the hosting computer. This server also some NodeJS
	libaries to be installed as well. Those are, express, http, path, and fs. When this server starts
	up it deletes the old database, and creates a new one. The server begins to listen on port 3000
	on the host machine.
*/

const express = require('express'); 
const http = require('http').Server.app; 
const path = require('path');
const fs = require('fs');  
const hostname = '127.0.0.1';
const port = 3000;
const sqlite3 = require("sqlite3").verbose();


//// On start up, set up database, if there already is one delete it.
var file = 'mytodo.db';
fs.access(file, fs.constants.R_OK | fs.constants.W_OK, (err) => { 
	if(!err)  {
		console.log(' Database file exists going to delete now. ');
		fs.unlink(file, (err) => {
			if (err) {
				console.log("Failed to delete database:"+err);
			}
        }); ////Do db delete file.
	} else {
		console.log(' Database file does not exist...');
	}
	var db = new sqlite3.Database(file);
	db.serialize(function() {
		var DROPtableStatement= "DROP TABLE IF EXISTS tasks;";
		db.run(DROPtableStatement);
		var CREATEtableStatement = "CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT,  duedate TEXT, priority TEXT, complete INTEGER, notes BLOB )";
		db.run(CREATEtableStatement);
		db.close();
		console.log(" Database created.");
	});
});
////Done Database check if exists and create.



const app = express();


////Set Static Path to Public folder.
app.use(express.static(path.join(__dirname,'public')));


////Set up server, listening at http://127.0.0.1:3000
app.listen(port, function() {
	var host = this.address().address;
	var port = this.address().port;
	console.log(" Listening at http://%s:%s", host, port);
});


////When root is requested send my.html
app.get('/', function(req, res) {
	console.log(" Got call to '/' sending index.html ");
	res.sendFile('public/my.html', {root: __dirname });
});



////When a get request for the table happens.
app.get('/table/', function (request, response) { 		
	console.log("\n Recived one GET request for the table. ");	
	var db = new sqlite3.Database(file); 
	db.serialize(function(){
		var SELECT_all_Statement = "SELECT * FROM tasks;";			
		db.all(SELECT_all_Statement,[],(err, rows ) => {			
			///Parse Notes array.
			for( var i=0; i < rows.length; i++ )
			{			
				var arr = rows[i].notes;
				rows[i].notes =	JSON.parse(arr);		
			}
			var jSON_COLLECTION = JSON.stringify(rows);						
			db.close();					
			response.send(jSON_COLLECTION); 											
		});			
	}.bind(this));	
});
////End of when a get request for the table happens.





////When a form post happens.
app.post('/recive_form/', function (request, response) { 		
	console.log("\n Recived one POST to recive_form. ");	
	var db = new sqlite3.Database(file);
	var input = request.header('jsonInput');//Gets the header jsonInput.	
		input = JSON.parse(input);
	var title = input[0];
	var description = input[1]; 
	var priority = input[2];
	var duedate = input[3];
	var complete = 0; /////Complete starts false. 
	var notes = [ ];	/////Empty notes to start.
	notes =  JSON.stringify(notes);
	var INSERTstatement = "INSERT INTO tasks ( id, title, description, duedate, priority, complete, notes) values ( null, \""+title+"\", \""+description+"\", \""+duedate+"\", \""+priority+"\", \""+complete+"\", \""+notes+"\" )";	
	var Succesful;				
	db.run( INSERTstatement, function(err){
		if(err) {
			console.log(" ERROR: "+err.message);
			Succesful = false;
		} else {
			console.log("  A new task has been inserted into the table. ");
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
////End of when a form post happens.





////When a delete task happens.
app.post('/delete_task/', function (request, response) { 		
	console.log("\n Recived one POST to delete_task.");	
	var db = new sqlite3.Database(file);	
	////TODO: Someday add some better security here.	
	var input = request.header('jsonInput');//Gets the header jsonInput.	
		input = JSON.parse(input);		
	var id = Number(input[0]);		
	var DeleteStatement = "DELETE FROM tasks WHERE id = '"+id+"';";	
	var db = new sqlite3.Database(file); 
	db.run( DeleteStatement, function(err){
		if(err) 
		{ console.log(" ERROR:"+err.message); Succesful = false; }
		else
		{ console.log(" Task record has been deleted"); Succesful = true; }
		db.close(); messageback = "";
		if(Succesful == true)
		{ messageback = "DELETE TASK SUCCESSFUL"; }
		else
		{ messageback = "Problem! DELETE COLLECTION was not SUCCESSFUL"; }
		response.send(messageback);			
	});		
});
////End of when a delete task happens.





/////When a change complete value occurs
app.post('/ChangeComplete/', function (request, response) { 		
	console.log("\n Recived one POST to ChangeComplete.");	
	var db = new sqlite3.Database(file);	
	/////TODO: Someday add some better security here.	
	var input = request.header('jsonInput');//Gets the header jsonInput.	
		input = JSON.parse(input);		
	var id = Number(input[0]);
	var complete = Number(input[1]);	
	if( complete == 0)
	{
		complete = 1;
	}
	else
	{
		complete = 0;
	}		
	var UPDATEstatement = "UPDATE tasks SET complete = \""+complete+"\" WHERE id = "+id+"; ";	
	var db = new sqlite3.Database(file); // Gives the connection to the data base, as in opens the file.	
	var Succesful;				
	db.run( UPDATEstatement, function(err){
		if(err) {
			console.log(" ERROR:"+err.message);
			Succesful = false;
		} else {
			console.log(" Task complete has been updated");
			Succesful = true;
		}
		db.close(); //Closes the database conection	
		messageback = "";
		if(Succesful == true) {
			messageback = "CHANGE COMPLETE SUCCESSFUL";			
		} else {
			messageback = "Problem! Change complete was not SUCCESSFUL";
		}
		response.send(messageback);
	});		
});
/////End of when a change complete value occurs






////When a new note gets added to a task.
app.post('/AddNote/', function (request, response) { 		
	console.log("\n Recived one POST to AddNote.");	
	var db = new sqlite3.Database(file);
	////TODO: Someday add some better security here.
	var input = request.header('jsonInput');//Gets the header jsonInput.	
		input = JSON.parse(input);		
	var id = Number(input[0]);
	var value = input[1];	
	var notes = input[2];
	notes = JSON.parse(notes);
	var rarr = [value, notes.length+1];
    notes.push(rarr);	/////push new value on notes array.
	notes =  JSON.stringify(notes);		/////store as json string.
	var UPDATEstatement = 'UPDATE tasks SET notes = \''+notes+'\' WHERE id = '+id+' ';	
	var db = new sqlite3.Database(file); // Gives the connection to the data base, as in opens the file.	
	var Succesful;				
	db.run( UPDATEstatement, function(err){
		if(err) {
			console.log(" ERROR:"+err.message);
			Succesful = false;
		} else {
			console.log(" Task's notes has been updated");
			Succesful = true;
		}
		db.close(); //Closes the database conection	
		messageback = "";
		if(Succesful == true) {
			messageback = "ADD NOTE SUCCESSFUL";			
		} else {
			messageback = "Problem! Change complete was not SUCCESSFUL";
		}
		response.send(messageback);
	});	
});
////End of when a new note gets added to a task.
