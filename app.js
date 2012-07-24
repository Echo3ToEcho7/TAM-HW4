var rally = require("./lib/rallyapi");

// Create a new connection to Rally
var conn = new rally.RallyConnection({
    username: "cobrien@rallydev.com",
    password: "Just4Rally",
    server: "demo02.rallydev.com"
});

console.log("Connecting to Rally");

// The connect method will validate the connection config
// and will give you your user object
conn.connect().when(function connected(user) {
	console.log("We are connected"); 

	// We want to find all the TimeEntryItems
	conn.findAll({
	   type: "TimeEntryItem",
	   fetch: ["Task", "Actuals", "Name", "Values", "Hours"].join(",")
	}).when(function foundTasks(results) {
		// When done, we will be processing the results
		var res = results.QueryResult.Results;

		// This function will handle the processing of the results
		// A for loop will not work due to the asynchronous nature
		// of JavaScript
		var processNext = function processNext(resList) {
			// If there is nothing in the list, we are done
			if (resList.length === 0) {
				return;
			}

			// Array.shift will pull the first item off the array
			var current = resList.shift();
			var j, jj;

			// Will will need to calculate the Totals
			var total = 0;
			console.log(current.Task.Name, current.Task.Actuals, current.Values.length);

			// Loop through all the TimeEntryValues gathering the Hours
			for (j = 0, jj = current.Values.length; j < jj; j++) {
				console.log("\t", current.Values[j].Hours);
				total += parseInt("" + current.Values[j].Hours, 10);
			}

			console.log("\tTotal", total);

			// Update the Task with the Actuals computed from the Time Sheet
			conn.update(current.Task._ref, {
				Task: {
					Actuals: total
				}
			}).when(function (taskUpdate) {
				// When done, process the next item on the list
				processNext(resList);
			});
		};	

		// Kick off the process
		processNext(res);
   });
});
