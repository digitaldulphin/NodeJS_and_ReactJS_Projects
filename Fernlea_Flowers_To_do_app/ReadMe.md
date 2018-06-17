The Fernlea Flowers To Do App.

This is a NodeJS based project with ReactJS managing the front end. The three files are uploaded are server.js, my.html, and FrontEnd.js. 
The server.js is a javascript file that acts as the nodejs server for the application. The my.html file is send when page gets requested. FrontEnd.js builds the user interface when page gets loaded.


To set up project on your own computer you must have NodeJS. You can download it at nodejs.org. Next create a folder for the application.
Next run "npm init", which will initialize node packages. Fill out required fields for package.json. Package name; todoapp, entry point; server.js, the rest of the options can be left blank. After package.json is created install express, by running "npm install express --save". Next install path, "npm install path --save". Next install sqlite3, "npm install sqlite3 --save". Next create server.js in the same folder as package.json. Next make a folder called public. In that folder place my.html and FrontEnd.js inside. Once you have the files in the right places, the last thing to do is change FrontEnd.js. The constant variable myhost needs to be 'localhost' or your ip address.
