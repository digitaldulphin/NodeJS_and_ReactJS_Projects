/*	NodeJS File: client.js
	Purpose: Tests the server rest API using http requests.

What is it and what does it do?
	The client.js is a Node.js app. It will  test the rest API with a series of HTTP requests. It 
	will check that all test have passed. It implements the NodeJS HTTP package. The client.js sets
	up the HTTP request and will check the response body of the request for expected information. 
	The client.js also will make additional HTTP collection GET request to the server to make sure 
	the collection data is as expected.

Created by Norman Potts
Lab2 of Web 2.0 and PHP frameworks.
*/

const express = require('express'); /// Include the express package.
const app = express();
const http = require('http');
var alltestsHavePassed = true; /// Start off as true, if a test fails switch to false.
	
/// Tests...
	
/// Test #1 - Check that an initial GET collection request is empty.
function TestOne( Switch ) {
	return new Promise(function(resolve, reject) {
		var options = { host: 'localhost', port: '8085', path: '/api/' };		
		callback = function(response) {
			var str = '';			
			response.on('data', function(msg) {	str += msg;	});						
			response.on('end', function() {				
				var collect = JSON.parse(str);
				var testOneFlag;
				if (collect.length < 1) 
				{    testOneFlag = true;    } 
				else
				{    testOneFlag = false;	}				
				if(Switch == 1) 
				{	testOneFlag = collect;	}											
				resolve(testOneFlag);
			});
		}
		http.request(options, callback).end();		
	});
}///End of function TestOne


/// TestTwo - Check that two POST collection request will insert the two items into the collection.
function TestTwo() {
	return new Promise(function(resolve, reject) {
		aFreshItemOne = [ "kale", "kale@email.com", "453-920-1231" ];
		aFreshItemTwo = [ "tomato", "tomato@email.com", "555-230-1111" ];
		aFreshItemOne = JSON.stringify(aFreshItemOne);
		aFreshItemTwo = JSON.stringify(aFreshItemTwo);
		runInsetPost(aFreshItemOne).then(function(SuccessfulOne) {	
			runInsetPost(aFreshItemTwo).then(function(SuccessfulTwo) {			
				var Successful;
				if(SuccessfulOne == true && SuccessfulTwo == true)
				{	Successful = true;	}				
				else
				{	Successful = false;	}						
				if (Successful == true) {
					TestOne(1).then(function(getTable) {						
					var arrExpected = [{"userid":1, "name":"kale", "email":"kale@email.com", "phone":"453-920-1231" }, {"userid":2, "name":"tomato", "email":"tomato@email.com", "phone":"555-230-1111" }]
						arrExpected = JSON.stringify(arrExpected);
						getTable = JSON.stringify(getTable);																								
						if( getTable == arrExpected) 
						{	Successful = true;	}
						else
						{	Successful = false; }												
						resolve(Successful);
					});					
				} else
				{	resolve(Successful);}
	});});});
}///End of Function TestTwo


/// Function runInsetPost.
/// Used in TestTwo, this function runs the insert of the given item using POST and http headers.
function runInsetPost(aFreshItem) {			
	return new Promise(function(resolve, reject) {
		var options = {	host: 'localhost', port: '8085', path: '/api/', method: 'POST', headers: {'jsonInput': aFreshItem } };		
		callback = function(response) {
			var str = '';			
			response.on('data', function(msg) {	str += msg; });			
			response.on('end', function() {
				var Successful;				
				if(	str == "CREATE ENTRY SUCCESSFUL")
				{	Successful = true;	}
				else
				{	Successful = false;	}
				resolve(Successful);
			});
		}			
		var req = http.request(options, callback).end();
	});
}/// End of Function runInsetPost


 /// Function TestThree
 /// Check that a PUT collection request with two items in a collection will replace the current
 /// collection with this new collection. Should run after test 1 and 2 so the arrExpected is correct.
function TestThree(print) {
	return new Promise(function(resolve, reject) {
	aFreshItemOne = [[ "Carrots", "Carrots@email.com", "111-222-3333" ], [ "Grass", "lawnMo@email.com", "666-555-4444" ] ];	
		aFreshItemOne = JSON.stringify(aFreshItemOne);	
		runPutplz(aFreshItemOne).then(function(SuccessfulOne) {				
				var Successful = false;
				if(SuccessfulOne == true)
				{	Successful = true;	}				
				else
				{	Successful = false;	}		
				if (Successful == true) {
					TestOne(1).then(function(getTable) {
						/// Data expected is an obj of what should be returned by GET after test 1 and 2 THEN test 3.
						var arrExpected = [{"userid":1, "name":"Carrots", "email":"Carrots@email.com", "phone":"111-222-3333" },{"userid":2, "name":"Grass", "email":"lawnMo@email.com", "phone":"666-555-4444" }]
						arrExpected = JSON.stringify(arrExpected);
						getTable = JSON.stringify(getTable);																		
						if( getTable == arrExpected) 
						{	Successful = true;	}
						else 
						{	Successful = false; }
						resolve(Successful);
					});					
				} else 
				{	resolve(Successful); }													
		});		
	});
}/// End of Function TestTree.


///Function runPutplz 
/// Used in test three, this function replaces the collection with given item.
function runPutplz(aFreshItem) {			
	return new Promise(function(resolve, reject) {
		var options = { host: 'localhost', port: '8085', path: '/api/', method: 'PUT', headers: {'jsonInput': aFreshItem } };		
		callback = function(response) {
			var str = '';			
			response.on('data', function(msg) {	str += msg;	});			
			response.on('end', function() {				
				var Successful;				
				if(	str == "REPLACE COLLECTION SUCCESSFUL")
				{	Successful = true;	}
				else
				{	Successful = false;	}
				resolve(Successful);
			});
		}			
		var req = http.request(options, callback).end();
	});
}/// End of function runPutplz.


/// Function TestFour
/// Checks that a  Delete collection request will remove all items from the collection. Can be ran
/// at anytime because it deletes everything. Test after should be repopulated before they are ran.
function TestFour() {
	return new Promise(function(resolve, reject) {
		var options = { host: 'localhost', port: '8085', path: '/api/', method: 'DELETE' };
		callback = function(response) {
			var str = '';			
			response.on('data', function(msg) { str += msg; });			
			response.on('end', function() {			
				var Successful;				
				if(	str == "DELETE COLLECTION SUCCESSFUL")
				{	Successful = true;	}
				else
				{	Successful = false;	}								
				if (Successful == true) {
					TestOne(1).then(function(getTable) {						
						var arrSent = [];
						arrSent = JSON.stringify(arrSent);
						getTable = JSON.stringify(getTable);
						if( getTable == arrSent) 
						{ Successful = true; }
						else
						{ Successful = false; }
						resolve(Successful);
					});				
				} else
				{ resolve(Successful); }			
			});
		}			
		var req = http.request(options, callback).end();
	});								
}/// End of Function TestFour.


/// Function TestFive
/// Checks that a GET item request will return the specific item form the collection. Test is set 
/// assuming tests 1, 2, and, 3 have been just ran.
function TestFive() {
	return new Promise(function(resolve, reject) {
		var options = { host: 'localhost', port: '8085', path: '/api/:id', headers: {'jsonInput': '3' } };
		callback = function(response) {
			var agtoo = '';
			response.on('data', function(msg) {	agtoo += msg; });			
			response.on('end', function() {				
				var Successful;				
				if( agtoo == "Problem! Could not select from table." )
				{ Successful = false; }
				else 
				{ Successful = true; var str = JSON.parse(agtoo); }				
				if (Successful == true) {
					TestOne(1).then(function(getTable) {						
						var arrExpected = str ;
						arrExpected = JSON.stringify(arrExpected[0]);
						getTable = JSON.stringify(getTable[0]);
						if( getTable == arrExpected)
						{ Successful = true; }
						else
						{ Successful = false; }
						resolve(Successful);
					});					
				} else
				{ resolve(Successful); }
			});
		}
		http.request(options, callback).end();
	});
}/// End function TestFive


 /// Function TestSix
 /// Check that a PUT item request will update the specific item in a collection.
function TestSix() {			
	return new Promise(function(resolve, reject) {
		aFreshItemOne = [ "Triangle", "Triangle@Box.com", "189-777-4321","3" ];
		aFreshItemOne = JSON.stringify(aFreshItemOne);	
		var options = { host: 'localhost', port: '8085', path: '/api/:id', method: 'PUT', headers: {'jsonInput': aFreshItemOne } };
			callback = function(response) {
				var str = '';
				response.on('data', function(msg) { str += msg; });			
				response.on('end', function(){					
					var Successful;				
					if(str == "UPDATE ITEM SUCCESSFUL")
					{ Successful = true; }
					else
					{ Successful = false; }										
					if (Successful == true) {
						TestOne(1).then(function(getTable) {						
							var arrSent = [{"userid":3, "name":"Triangle", "email":"Triangle@Box.com", "phone":"189-777-4321" },{"userid":2, "name":"tomato", "email":"tomato@email.com", "phone":"555-230-1111" }]
							arrSent = JSON.stringify(arrSent[0]);
							getTable = JSON.stringify(getTable[0]);						 
							if( getTable == arrSent)
							{ Successful = true; }
							else
							{ Successful = false; }
							resolve(Successful);
						});					
					} else
					{ resolve(Successful); }					
				});
			}
		http.request(options, callback).end();
	});
}/// End of function TestSix.
 
 
 /// Function TestSeven
 /// Check that a DELETE item request will delete a specific item from the collection.
function TestSeven() {	
	return new Promise(function(resolve, reject) {		
		var options = { host: 'localhost', port: '8085', path: '/api/:id', method: 'DELETE', headers: {'jsonInput': '3' } };
			callback = function(response) {
				var str = '';
				response.on('data', function(msg) { str += msg; });			
				response.on('end', function() {					
					var testSixFlag;				
					if(str == "DELETE ITEM SUCCESSFUL")
					{ Successful = true; }
					else
					{ Successful = false; }										
					if (Successful == true) {
						TestOne(1).then(function(getTable) {
							var arrExpected = [{"userid":4, "name":"tomato", "email":"tomato@email.com", "phone":"555-230-1111" }];
							arrExpected = JSON.stringify(arrExpected);
							getTable = JSON.stringify(getTable);														
							if( getTable == arrExpected) 
							{ Successful = true; }
							else
							{ Successful = false; }
							resolve(Successful);
						});						
					} else
					{ resolve(Successful); }							
				});				
			};		
		http.request(options, callback).end();
	});
}/// End of function TestSeven.

	
/// Run Test
console.log("\n\nRun Test 1");
TestOne(0).then(function(testOneFlag) { console.log("    Test One: "+testOneFlag);	

console.log("\n\nRun Test 2");	
TestTwo().then(function(testTwoFlag) { console.log("    Test Two: "+testTwoFlag);

console.log("\n\nRun Test 3");	
TestThree().then(function(testThreeFlag) { console.log("    Test Three: "+testThreeFlag);
		  
console.log("\n\nRun Test 4");	
TestFour().then(function(testFourFlag) { console.log("    Test Four: "+testFourFlag);
	

/// Re run tests 1,2 and 3 to repopulated the table.
console.log("\n\n\nRe-run test 1 2 and 3 to repopulated the table so tests next tests can be completed.");
console.log("Run Test 2");	

TestTwo().then(function(nope) {	 console.log("Run Test 3");	
TestThree().then(function(doesnt) { console.log("Run Test 1");
TestOne(1).then(function(count) { console.log("Table has been repopulated ready for test 5 6 and 7...\n\n\n");
	

console.log("\n\nRun Test 5");	
TestFive().then(function(testFiveFlag) { console.log("    Test Five: "+testFiveFlag);
	
	
console.log("\n\nRun Test 6");
TestSix().then(function(testSixFlag) { console.log("    Test Six: "+testSixFlag);	  

console.log("\n\nRun Test 7");
TestSeven().then(function(testSevenFlag) { console.log("    Test Seven: "+testSevenFlag);

	console.log("\n");
	/// If all tests have passed,
	/// 	print to console "ALL TESTS SUCCESSFUL" 
	if( testOneFlag == true && testTwoFlag == true && testThreeFlag == true && testFourFlag == true && testFiveFlag == true && testSixFlag == true && testSevenFlag == true )
	{ console.log("ALL TESTS SUCCESSFUL"); }
	else
	{ console.log("TEST WERE NOT SUCCESSFUL"); }
	
});
});
});
});
});
});
});
});
});
});

/* End of client.js
Created by Norman Potts
Lab2 of Web2.0 and php frameworks.
Student Id 000344657
StAuth10065: I Norman Potts, 000344657 certify that this material is my original work. No other 
person's work has been used without due acknowledgement. I have not made my work available to 
anyone else. */