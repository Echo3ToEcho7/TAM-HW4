TAM-HW4
=======

Week 4's homework

RallyConnection API
===================

## new RallyConnection(opts)

### Possible Options

 * server - The server to connect to. [default: "rally1.rallydev.com"]
 * username - The username to connect with. [required]
 * password - The password to use to connect with. [required]
 * version - The WSAPI version to use. [default: "1.36"]

### Example

	var connection = new RallyConnection({
		username: "paul@acme.com",
		password: "SuperSecret!"
	});

## RallyConnection.connect()

Tests the connection to Rally by hitting the Current User endpoint
(/slm/webservice/{VERSION}/user.js).

Returns a Future object that when fulfilled with give you the JSON
Object representing the User

### Example

	conn.connect().when(function connected(user) {...});

## RallyConnection.find(opts)

### Possible Options

 * type - The type of Rally Artifact to find [required]
 * fetch - The attributes you want to have returned
 * query - The Rally Query to perform
 * start - The starting object to find.  1-based index
 * pagesize - The number of objects to return.

Returns a Future Object that when fulfilled will contain the results of
the query.

### Example

	conn.find({
		type: "Task",
		fetch: "Name,ScheduleState"
	}).when(function foundTasks(results) {...});

## RallyConnection.findAll(opts)

Like find, but will get all objects that match the query.

### Possible Options

*See RallyConnection.find*

## RallyConnection.update(ref, object)

Updates a Rally Object

### Example

	conn.update(someTask._ref, {
		Task: {
			Name: "New Name"
		}
	}).when(function updateCompleted(theUpdatedTask) {...});
