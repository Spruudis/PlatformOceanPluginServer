//-----------------------Imports------------------------
const EventProxy = require('./EventProxy.js');
const HookProxy = require('./HookProxy.js');
const DatabaseProxy = require('./DatabaseProxy.js');
//------------------------------------------------------

/** Class holds the basic components of any node (plug in or server base) in the server.
 */
class ServerNode{

    /**
     * Create a base node.
     */
    constructor() {

        //Step x: Set up Event API
        this.eventProxy = EventProxy.getInstance();

        //Step x: Set up Hook API
        this.hookProxy = new HookProxy();

        //Step x: Set up Database API
        this.databaseProxy = DatabaseProxy.getInstance();

        //Stores references to all child plugins for server startup
        this.plugins = [];
    }

    //Here so my IDE would think all is cool
    propagatedDatabaseClient(dbName, options){
        console.error("Issue with database client propagation");
    }

}

module.exports = ServerNode;