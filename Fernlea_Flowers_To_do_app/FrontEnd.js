
	/** FrontEnd.js
		Created by Norman Potts.
		This javascript file uses ReactJS to manage the frontend of the Todoapp.
		The parent component is Todoapp, which is written at the bottom. It has two children 
		components, on for the list, and one for the form. The form sends the task information to 
		the server.js file. The list loads every time the page refreshes or after an input sent.
		The componets are loaded into the 'App' div on the my.html file.
	*/
	const myhost = '192.168.1.167';

	//// Begining of list component
	var Mylist = React.createClass({ 				
		handleDelete: function(task) {
			if(confirm("Delete task: "+task.title))
			{
				if(confirm("Are you sure you want to delete this task? This cannot be reversed. "))
				{
					var id = task.id;					
					var formitem =  [ id ];	 //// Put form data into array, 		
					var jsonItem = JSON.stringify( formitem );				 //// Package form item as a json string.
					var http = new XMLHttpRequest();						 //// set up http request and set item. 
					http.onreadystatechange = function() {
						if (http.readyState == 4 && http.status == 200) {
							var response = http.responseText;						
							if(response == "DELETE TASK SUCCESSFUL") {								
								this.props.LoadList();
							}
						}
					}.bind(this);
					//var url = 'http://localhost:3000/delete_task/';
					var url = 'http://'+myhost+':3000/delete_task/'
					http.open('POST', url, true);							
					http.setRequestHeader('jsonInput', jsonItem);
					http.send(  jsonItem  );															
				}
			}
		},
		CompleteChange: function(task) {			
			var complete = task.complete;
			var id = task.id;			
			var formitem =  [ id, complete ];	                     //// Put form data into array, 		
			var jsonItem = JSON.stringify( formitem );				 //// Package form item as a json string.
			var http = new XMLHttpRequest();						 //// set up http request and set item.
			http.onreadystatechange = function() {
				if (http.readyState == 4 && http.status == 200) {
					var response = http.responseText;						
					if(response == "CHANGE COMPLETE SUCCESSFUL") {								
						this.props.LoadList();
					}
				}
			}.bind(this);
			//var url = 'http://localhost:3000/ChangeComplete/';
			var url = 'http://'+myhost+':3000/ChangeComplete/'
			http.open('POST', url, true);							
			http.setRequestHeader('jsonInput', jsonItem);
			http.send(  jsonItem  );												
		},
		render: function() { 			
			const tsakCss = { fontSize:'75%', marginBottom: '1em', display: 'block', border: '3px solid rgb(255, 128, 128)', background: 'rgb(255, 193, 179)' };
			const ttleCss = { fontSize: '1.3em', margin:'0', display: 'block', border: '1px solid rgb(255, 128, 128)', paddingLeft:'1em', overflow: 'hidden' };
			const desCss  = { paddingBottom:'1em',margin:'0', display: 'block', border: '1px solid rgb(255, 128, 128)', paddingLeft:'1em', overflow: 'hidden' };
			const bottumRow = {margin:'0', display:'block', border: '1px solid rgb(255, 128, 128)'};
			const lvl  = {height: '100%', paddingLeft:'1em', display: 'inline-block',width:'25%',  borderRight: '1px solid rgb(255, 128, 128)' };
			const due  = {height: '100%', paddingLeft:'1em', display: 'inline-block',width:'25%',  borderLeft: '1px solid rgb(255, 128, 128)', borderRight: '1px solid rgb(255, 128, 128)' };
			const comp = {height: '100%', paddingLeft:'1em', display: 'inline-block', width:'25%', borderLeft: '1px solid rgb(255, 128, 128)', borderRight: '2px solid rgb(255, 128, 128)'  };
			const delspace = {paddingLeft:'1em', display: 'inline-block'};
			const nteos = {paddingLeft:'1em', margin:'0', padding:'0', border: '1px solid rgb(255, 128, 128)'};			
			return ( 
				<ul id = "list">				
				{this.props.internalArr.map((task) => (  						
				  	  <li style = {tsakCss} key = {task.id}>
						<div  style = {ttleCss} >Task: {task.title}</div>						
						<p style ={desCss}> Description: {task.description} </p>
						<div style = {nteos}> Notes 							
							<Noteslist  notes = {task.notes} task = {task} reload = {this.props.LoadList} />
						</div>							
						<p style={bottumRow}>
							<span style ={lvl} > Level {task.priority} Priority </span>
							<span style = {due}> Due Date: {task.duedate} </span>
							<span style = {comp}> Completed: <input type="checkbox" defaultChecked={task.complete} onChange={ () =>  this.CompleteChange(task)} />  </span>		
							<span style = {delspace}> <button onClick = {  () =>  this.handleDelete(task)} >Delete</button>  </span>									
						</p>																
					  </li>
				  	))}									
				</ul> 					
			);
		},
	});
	//// End of Mylist.
	
	
	
	
	//// Note component in list component.
	var Noteslist = React.createClass({ 		
		getInitialState:function() { 
			return {
				input:""
			}
		},
		inputChange: function(event) {
			var i = event.target.value;
			this.setState({input: i });
		},
		insertNote: function(task) {
			var id = task.id;			
			var value = this.state.input;
			var nootees =  this.props.notes;
			nootees = JSON.stringify(nootees);
			if(value != "" )
			{				
				var formitem =  [ id, value, nootees ];	                         //// Put form data into array, 		
				var jsonItem = JSON.stringify( formitem );				 //// Package form item as a json string.
				console.log(jsonItem);
				var http = new XMLHttpRequest();						 //// set up http request 
				http.onreadystatechange = function() {
					if (http.readyState == 4 && http.status == 200) {
						var response = http.responseText;						
						if(response == "ADD NOTE SUCCESSFUL") {								
							this.props.reload();
						}
					}
				}.bind(this);
				//var url = 'http://localhost:3000/AddNote/';
				var url = 'http://'+myhost+':3000/AddNote/'
				http.open('POST', url, true);							
				http.setRequestHeader('jsonInput', jsonItem);
				http.send(  jsonItem  );
				this.setState({input: "" });
				this.props.reload();
			}
		},
		render: function() {
		return ( 
			<div id = "NoteComponent">
				<ol>
				{this.props.notes.map((note) => (  
					<li key = {note[1]} >{note[0]}</li>					
				))}					
				</ol>
				<input type="Text" name ="Note" size="20" value={this.state.input} onChange={this.inputChange} ></input>
				<button onClick = {()=> this.insertNote(this.props.task)} > Add Note </button>				
			</div>				
		)},
	});
	//// End of Note component in list component.
		
		
	
	
	//// Mydateselector component for selecting dates.
	var Mydateselector = React.createClass({
		getInitialState:function() { 
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth(); //January is 0!
			var yyyy = today.getFullYear();			
			var Arryears  = [ yyyy, yyyy+1, yyyy+2, yyyy+3, yyyy+4, yyyy+5];		
			var Arrmonths = ['January','February','March','April','May','June','July','August','September','October','November','December']; 		
			var DisMonth = Arrmonths[mm];							
			var  Arrdays = this.CalculateDaysArr(DisMonth,yyyy);												
			return {				
				Day: dd, Month: DisMonth, Year: yyyy , dayss: Arrdays, monthss: Arrmonths, yearss:Arryears																	
			};			
		},
		componentWillMount:function() {
			this.props.dateChange(this.state.Day, this.state.Month, this.state.Year);
		},		
		CalculateDaysArr: function(month, year) {			
			var ArrDays = [];
			var NumDaysinMonth;			
			 // 31 or 30 days?
			if(month === 'January' || month === 'March' || month === 'May' || month === 'July' || month === 'August' || month === 'October' || month === 'December') {
				NumDaysinMonth = 31;
			} else if(month === 'April' || month === 'June' || month === 'September' || month === 'November') {
				NumDaysinMonth = 30;
			} else {
				// If month is February, calculate whether it is a leap year or not
				var yr = year;
				(yr - 2016) % 4 === 0 ? NumDaysinMonth = 29 : NumDaysinMonth = 28;
			}			
			var di= 0;
			do {
				di++;
				ArrDays.push(di);				
			}while(di < NumDaysinMonth )						
			return ArrDays;			
		},
		DayChange: function(event) {
			var d  =  event.target.value;
			var y  = this.state.Year;
			var m  = this.state.Month;
			this.props.dateChange(d, m, y);
			this.setState({ Day: d,});						
		},
		MonthChange: function(event) {			
			var y  = this.state.Year;
			var m  =  event.target.value;			
			var  Arrdays = this.CalculateDaysArr(m,y);	
			var d = 0; // Set the new day state to the current state day if the last day of the set month is  is less than the current day state.		
			var lstdy = Arrdays.length;			
			if ( lstdy < this.state.Day )
			{
				d = lstdy;
			}
			else 
			{
				var s = this.state.Day;
					d = Number(s);
			}					
			this.props.dateChange(d, m, y);		
			this.setState({ Month: m, dayss: Arrdays, Day: d});					
		},
		YearChange: function(event) {						
			var m  = this.state.Month;
			var y  =  event.target.value;			
			var  Arrdays = this.CalculateDaysArr(m,y);	
			var d = 0; // Set the new day state to the current state day if the last day of the set month is  is less than the current day state.
			var lstdy = Arrdays.length;			
			if ( lstdy < this.state.Day )
			{
				d = lstdy;
			}
			else 
			{
				var s = this.state.Day;
				d = Number(s);
			}			
			this.props.dateChange(d, m, y);	
			this.setState({ Year: y, dayss: Arrdays, Day: d });			
		},			
		render: function() {			
			return (
				<span id = "Mydateselector">																													
					<span> Year <select id="year" name="year"  value={this.state.Year} onChange={this.YearChange}>							  
							    {this.state.yearss.map((item) => (
									<option  key = {item} value = {item} >{item}</option>
								))}								
						        </select>
					</span>
					<span> Month <select id="month" name="month"  value={this.state.Month} onChange={this.MonthChange}>
								{this.state.monthss.map((item) => (
									<option  key = {item} value = {item} >{item}</option>
								))}
								</select>
					</span>						
					<span> Day <select id="day" name="day"  value={this.state.Day} onChange={this.DayChange}>
								{this.state.dayss.map((item) => (																
									<option key = {item} value = {item} >{item}</option>									
								))}
								</select>
					</span>						
				</span>							
			)
		},
	});
	//// End of Mydateselector component for selecting dates.

	

	
	/// Begining of Myform component
	var Myform  = React.createClass({    
		getInitialState:function() { 			
			return {				
				priority: 3, title:'', description:''												
			};
		},	
		priorityChange:function(event) {
			var p = event.target.value;
			this.setState({ priority:p });			
		},
		EnterNewTaskClick: function(event) {
			event.preventDefault(); 
			var description, title, priority, date;
			description = this.state.description;
			title = this.state.title;
			priority = this.state.priority;
			date = this.state.date;
				var formitem =  [ title, description, priority, date ];	 //// Put form data into array, 		
				var jsonItem = JSON.stringify( formitem );				 //// Package form item as a json string.
				var http = new XMLHttpRequest();						 //// set up http request and set item to recive_form.
				http.onreadystatechange = function() {
					if (http.readyState == 4 && http.status == 200) {
						var response = http.responseText;						
						if(response == "CREATE ENTRY SUCCESSFUL") {
							this.setState({ priority: 3, title:'', description:''});
							this.props.LoadList();
						}
					}
				}.bind(this);
				//var url = 'http://localhost:3000/recive_form/';
				var url = 'http://'+myhost+':3000/recive_form/'
				http.open('POST', url, true);							
				http.setRequestHeader('jsonInput', jsonItem);
				http.send(  jsonItem  );		
		},							
		descriptionChange: function(event) {
			var d = event.target.value;
			this.setState({ description:d });	
		},
		titleChange: function(event) {
			var t = event.target.value;
			this.setState({ title:t });	
		},
		dateChange: function(d, m, y) {			
			
			var date = y+" "+m+" "+d;
				console.log("Date: "+date);
			this.setState( { date:date } );
		},
		render: function() { 		
			const Txtarea = {   resize: 'none', display: 'inline' };					
			return ( 			
				<form>
					<p> Add to To do list. </p> 						
					<p> Title: <input type="Text" name ="title" size="50"  value={this.state.title} onChange={this.titleChange} ></input>	</p>
					<p> Description: </p><p><textarea style = {Txtarea} value={this.state.description}   name ="description" maxLength ="200" rows="4" cols="50"    onChange={this.descriptionChange}  ></textarea>	</p>
					<p> Due Date: <Mydateselector dateChange = {this.dateChange} /> </p>
					<p> Priority:  <select id="priority" name="priority"  value={this.state.priority} onChange={this.priorityChange}>																						
									<option value = {1} >Level 1</option>									
									<option value = {2} >Level 2</option>									
									<option value = {3} >Level 3</option>									
									<option value = {4} >Level 4</option>									
									<option value = {5} >Level 5</option>																		
								   </select> Level 1 most important, level 5 least important.
					</p>										
					<p>
						<button  onClick = { this.EnterNewTaskClick } > add </button>						
					</p>
				</form>					
			);
		},
	});
	/// End of Myform.

	
	

	/// Begining of To do list page, Parent for application.
	var Todoapp = React.createClass({  
		getInitialState:function() { 			
			return {				
				internalArr: []																
			};
		},
		componentWillMount: function() {
			this.loadArray();
		},		
		loadArray: function() {	
			var http = new XMLHttpRequest();
			http.onreadystatechange = function() {
				if (http.readyState == 4 && http.status == 200) {
					var response = http.responseText;							
					var records  =  JSON.parse( response );									
					this.setState({   internalArr: records  });												
				}
			}.bind(this);
			//var url = 'http://localhost:3000/table/';
			var url = 'http://'+myhost+':3000/table/'
			http.open('GET', url, true);										
			http.send();								
		},	    
		render: function() { 
			return ( 
				<div id="TodoPage">
					<h2>To Do App</h2>
					<Myform LoadList = {this.loadArray} />						
					<Mylist LoadList = {this.loadArray} internalArr = {this.state.internalArr} />					
				</div> 
			);
		},
	});
	/// End of Todoapp.
	

    ReactDOM.render ( <Todoapp />, document.getElementById("App") );
	/// Write the entire thing to the App div.	