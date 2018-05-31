/**	File server.js
	Purose: This file is lab4 for the course Web 2.0. This file allows for a teacher and multiple 
	        students to access the application. One teacher can access the application by the url
			"http://localhost:3000/teacher". One or more students can access the application by the 
			url "http://localhost:3000/student". 
			
			What a teacher can do with the application.
				-> Can Create a question and set the details of the question, such as time-limit and
				   the question type with the data required for the question type.
				-> Once the question has been appropriately created, the teacher can click a submit 
				   button to send to the students.				   
				-> After question is submitted a timer displayes on the teacher page and it counts
				   down each second from the specified time zero.
				-> The teacher cannot create a new question until the counter is done.				
				-> After the teacher submits the question the interface for creating a question 
				   should disappear.				   
				-> The results of any students answering the questions should be displayed and 
				   updated in real-time as each student answers the question.
				
				
			What a student can do with the application.
				-> Gets the "waiting for a question" text when first visit the application.				
				-> When teacher has submitted a question the text changes to an interface that 
				   allows student to answer the question.				   
				-> The student has to answer within the time limit.				
				-> When studnet submits an answer for the question the students page is updated with 
				   whether they answered the question correctly or incorrectly.				   
				-> When student answers inncorrectly the right answer is presented.				
				-> When the timer reaches zero the text waiting for a question should appread again 
				   and the interface to submit an answers should disappear but the results of the last
				   answer can stay.
				
*/
console.log("Start up Lab 4. Created by Norman Potts. \n\n");
const express = require('express');//Include the express package
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');//File System package   	
var correctanswer = ""; // Initially correct answer is blank			

/// Run the server, and listen for request at 8085
var server = http.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;		
	console.log("Listening at http://%s:%s", host, port);
});
		

var CountofTeachers = 0;
app.get('/teacher', function(req, res) {  	
	//Send teachers html.
	//If teacher count less than 1 allow them to have teacher html and increment, otherwise send teacher full html.	
	if( CountofTeachers == 0) {	
		console.log("Teacher allowed access");
		CountofTeachers++;			
		res.sendFile(__dirname + '/Teacher/teacher.html');
	} else  {
		console.log("Teacher denied access too many...");
		res.sendFile(__dirname + '/Block_Teacher/index.html');
	}				
});	

	
var countofStudents = 0;
/// When an studnet url gets requested */
app.get('/student', function(req, res)
{  	/*Send the student html */
	res.sendFile(__dirname + '/Student/student.html');
	console.log("Student");
	countofStudents++;		
});
	
	
io.on('connection', function(socket) {  
	var studentName = "";		
	/// Receive name input. 
	socket.on('EnterName', function(Name) {			
		studentName = Name;
		console.log(studentName);		
		socket.broadcast.emit("ClientEnteredName", {
			name: Name
		});												
	});			
	/// if a question is submitted 
	socket.on('submitquestion', function(quesdata){
		/// What is the question, ? log into the console for dubug 
		console.log("question submitted: " + JSON.stringify(quesdata));	
		/// Set the correct answer 
		correctanswer = quesdata.answer;		
		/// Brocast the question to all connections execpt sender, as in teacher 
		socket.broadcast.emit('deliverquestion', quesdata);
	});
	/// If an answer to the question is recived 
	socket.on('answerquestion', function(answerdata) {
		/// What is the answer? log it in the console for debug 
		console.log("answer submitted: " + JSON.stringify(answerdata));				
		/// Send back to client, this will send to all clients...
		socket.broadcast.emit("results", {
			correct: (correctanswer == answerdata.Answer),
			Correctanswer: correctanswer,
			name: answerdata.Name,
			Qtype: answerdata.Qtype,
			youAnser: answerdata.Answer
		});		
		/// Send back the result but only to the client that send the answer. 
		io.to(socket.id).emit("resultquestion", {
			correct: (correctanswer == answerdata.Answer),
			answer: correctanswer,
			youAnser: answerdata.Answer
		});									 
	});
});
/// End of server.js Created by Norman Potts.
