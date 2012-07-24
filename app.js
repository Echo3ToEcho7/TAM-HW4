var rally = require("./lib/rallyapi");

var conn = new rally.RallyConnection({
    username: "cobrien@rallydev.com",
    password: "Just4Rally",
    server: "demo02.rallydev.com"
});

console.log("Connecting to Rally");

conn.connect().when(function connected(results) {
   console.log("We are connected"); 
	var now = new Date();

   conn.find({
	   type: "TimeEntryItem",
	   fetch: ["Task", "Actuals", "Name", "Values", "Hours"].join(","),
	   query: '(Task.Iteration.State = "Committed")'
	}).when(function foundTasks(results) {
		var res = results.QueryResult.Results;

		var processNext = function processNext(resList) {
			if (resList.length === 0) {
				return;
			}

			var current = resList.shift();
			var j, jj;

			var total = 0;
			console.log(current.Task.Name, current.Task.Actuals, current.Values.length);

			for (j = 0, jj = current.Values.length; j < jj; j++) {
				console.log("\t", current.Values[j].Hours);
				total += parseInt("" + current.Values[j].Hours, 10);
			}

			console.log("\tTotal", total);

			conn.update(current.Task._ref, {
				Task: {
					Actuals: total
				}
			}).when(function (taskUpdate) {
				processNext(resList);
			});
		};	

		processNext(res);
   });
});
