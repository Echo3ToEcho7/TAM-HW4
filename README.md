TAM-HW4
=======

Week 4's homework

RallyConnection API
===================

** new RallyConnection(opts) **

*** Possible Options ***

 * server - The server to connect to. [default: "rally1.rallydev.com"]
 * username - The username to connect with.
 * password - The password to use to connect with.
 * version - The WSAPI version to use. [default: "1.36"]

*** Example ***

	var connection = new RallyConnection({
		username: "paul@acme.com",
		password: "SuperSecret!"
	});


