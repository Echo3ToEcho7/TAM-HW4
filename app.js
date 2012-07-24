var rally = require("./lib/rallyapi");

var conn = new rally.RallyConnection({
    username: "cobrien@rallydev.com",
    password: "Just4Rally",
    server: "demo01.rallydev.com"
});

console.log("Connecting to Rally");

conn.connect().when(function connected(results) {
   console.log("We are connected"); 
});