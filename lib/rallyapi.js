var URI = require('URIjs');
var Future = require("future");
var restler = require('restler');

var Types = {
	HIERARCHICAL_REQUIREMENT: "HierarchicalRequirement",
	STORY: "HierarchicalRequirement",
	TASK: "Task",
	DEFECT: "Defect",
	USER: "User",
	USERS: "Users"
};

var RallyConnection = function RallyConnection(opts) {
	this.opts = {};
	this.opts.username = opts.username || "";
	this.opts.password = opts.password || "";
	this.opts.server = opts.server || "rally1.rallydev.com";
	this.opts.version = opts.version || "1.36";
};

RallyConnection.prototype._generateQueryURL = function _generateQueryURL(type, query) {
	return (new URI(""))
		.protocol("https")
		.hostname(this.opts.server)
		.path("/slm/webservice/" + this.opts.version + "/" + type + ".js")
		.query(query);
};

RallyConnection.prototype._generateRefURL = function _generateRefURL(type, oid) {
	return (new URI(""))
		.protocol("https")
		.hostname(this.opts.server)
		.path("/slm/webservice/" + this.opts.version + "/" + type + "/" + oid + ".js");
};

RallyConnection.prototype._generateURL = function _generateURL(opts) {
	if (opts.hasOwnProperty("query")) {
		return this._generateQueryURL(opts.type, opts.query) + "";
	} else {
		return this._generateRefURL(opts.type, opts.oid) + "";
	}
};

RallyConnection.prototype.connect = function connect() {
	var future = Future.create(this);
	var uri = this._generateURL({type: Types.USER, query: {fetch: "Username"}});

	restler.get(
		uri, 
		{ username: this.opts.username, password: this.opts.password }
	).on("complete", function onComplete(results) {
		future.fulfill(results);
	});

	return future;
};

RallyConnection.prototype.find = function find(opts) {
	var q = {
		start: opts.start || 1,
		pagesize: opts.count || 200
	};

	var future = Future.create(this);

	if (typeof opts.query === "string") {
		q.query = opts.query;
	}

	if (typeof opts.fetch === "string") {
		q.fetch = opts.fetch;
	}

	restler.get(
		this._generateURL({type: opts.type, query: q}), 
		{ username: this.opts.username, password: this.opts.password }
	).on("complete", function findComplete(results) {
		future.fulfill(JSON.parse(results));
	});

	return future;
};

RallyConnection.prototype.findAll = function findAll(opts) {
	var future = Future.create(this);
	var me = this;
	var totalProcessed = 0;
	var allResults = {
		QueryResult: {
			Results: [],
			Errors: [],
			Warnings: []
		}
	};

	opts.pagesize = opts.pagesize || 200;
	opts.start = opts.start || 1 - opts.pagesize;

	var processNext = function processNext(opts) {
		opts.start += opts.pagesize;

		me.find(opts).when(function processResults(results) {
			allResults.QueryResult.Results =
				allResults.QueryResult.Results.concat(results.QueryResult.Results);
			allResults.QueryResult.Errors =
				allResults.QueryResult.Errors.concat(results.QueryResult.Errors);
			allResults.QueryResult.Warnings =
				allResults.QueryResult.Warnings.concat(results.QueryResult.Warnings);

			totalProcessed = allResults.QueryResult.Results.length;

			if (totalProcessed < results.QueryResult.TotalResultCount) {
				processNext(opts);
			} else {
				future.fulfill(allResults);
			}
		});
	};

	processNext(opts);

	return future;
}

RallyConnection.prototype.update = function update(ref, obj) {
	var future = Future.create(this);

	restler
		.post(ref, {
			username: this.opts.username, 
			password: this.opts.password,
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(obj)
		})
		.on("complete", function updateComplete(results) {
			future.fulfill(JSON.parse(results));
		});

	return future;
};

module.exports.RallyConnection = RallyConnection;
module.exports.Types = Types;
