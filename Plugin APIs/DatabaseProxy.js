const mongo = require('mongodb');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017";

class _DatabaseProxy {

    #dBClient;

    constructor() {
        this.parent = {} //TODO:
    }

    setDatabaseClient(client){
        console.log("---DatabaseProxy: Setting the client");
        this.#dBClient = client;
    }

    /**
     * Create a new Db instance sharing the current socket connections. Be aware that the new db instances are
     * related in a parent-child relationship to the original instance so that events are correctly emitted on child
     * db instances. Child db instances are cached so performing db('db1') twice will return the same instance.
     *
     * @method
     * @param {string} [dbName] The name of the database we want to use. If not provided, use database name from connection string.
     * @param {object} [options] Optional settings.
     * @param {boolean} [options.noListener=false] Do not make the db an event listener to the original connection.
     * @param {boolean} [options.returnNonCachedInstance=false] Control if you want to return a cached instance or have a new one created
     * @return
     */

    //Used by plugin and child Database Proxy
    databaseClient(dbName, options){
        if(typeof this.#dBClient === 'undefined'){
            return{
                databaseFound: false,
                client: undefined
            }
        }
        return {
            databaseFound: true,
            client: this.#dBClient.db(...arguments)
        }
    }

    closeConnection(){
        this.#dBClient.close();
    }




}

//Handles database management on a server level. Connects database to all plugins and manages database protocol.
//Responsible for serving a database instance to a plug-in.
const DatabaseProxy = (function () {
    let DatabaseProxyInstance;

    function createInstance() {
        return new _DatabaseProxy();
    }

    return {
        getInstance: function () {
            if (!DatabaseProxyInstance) {
                DatabaseProxyInstance = createInstance();
            }
            return DatabaseProxyInstance;
        }
    };
})();


module.exports = DatabaseProxy;