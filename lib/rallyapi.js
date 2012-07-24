var URI = require('URIjs');
var Future = require("future");
var restler = require('restler');

var Types = {
    HIERARCHICAL_REQUIREMENT: "hierarchicalrequirement",
    STORY: "hierarchicalrequirement",
    TASK: "task",
    DEFECT: "defect",
    USER: "user",
    USERS: "users"
};

var RallyConnection = function RallyConnection(opts) {
    this.opts = {};
    this.opts.username = opts.username || "";
    this.opts.password = opts.password || "";
    this.opts.server = opts.server || "rally1.rallydev.com";
    this.opts.version = opts.version || "1.36";
};

RallyConnection.prototype._generateQueryURL = function _generateQueryURL(type, query) {
    return (new URI(this.opts.server))
        .protocol("https")
        .path("/slm/webservice/" + this.opts.version + "/" + type)
        .query(query);
};

RallyConnection.prototype._generateRefURL = function _generateRefURL(type, oid) {
    return (new URI(this.opts.server))
        .protocol("https")
        .path("/slm/webservice/" + this.opts.version + "/" + type + "/" + oid + ".js");
};

RallyConnection.prototype._generateURL = function _generateURL(opts) {
    if (opts.hasOwnProperty("query")) {
        return this._generateQueryURL(opts.type, opts.query);
    } else {
        return this._generateRefURL(opts.typs, opts.oid);
    }
};

RallyConnection.prototype.connect = function connect() {
    var future = Future.create(this);
    var uri = this._generateURL({type: Types.USER, query: {fetch: "Username"}});
    
    console.log("Uri", uri);
    
    restler.get(
        uri, 
        { username: this.opts.username, password: this.opts.password }
    ).on("complete", function onComplete(results) {
        console.log(results);
        future.fulfill(results);
    });
    
    return future;
};

RallyConnection.prototype.find = function find(type, query, start, count) {
    var q = {
        start: start || 1,
        pagesize: count || 200
    };
    
    if (typeof query !== "undefined") {
        q.query = query;
    }
    
    
};

module.exports.RallyConnection = RallyConnection;