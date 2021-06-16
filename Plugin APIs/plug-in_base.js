//-----------------------Imports------------------------
const ServerNode = require("./ServerNode.js");
//------------------------------------------------------

//TODO: Unique id for database access for each plug-in present in the server hierarchy to allow multiple instances with
// different databases

/** Class implements the basic functionality of a plug-in.
 * Every plug-in should inherit from this class.
 */
class BasePlugIn extends ServerNode{



    /**
     * Create a base plug-in.
     * @param {ServerNode} parentObject
     */
    constructor(parentObject) {
        super();
        this.parentObject = parentObject;
        //TODO: Figure out when to assign parent
    }


    /**
     * Publishes an event occurrence
     * @param {string} eventName - Name of the event
     * @param {*} msg - Incoming Message
     */
    publishEvent(eventName,msg){
        this.eventProxy.publish(eventName, msg);
    }

    /**
     * Subscribes the plug-in to an event
     * @param {string} eventName - Name of the event
     * @param {function(EventProxyResponder): void} callback - Callback to be executed on event
     */
    subscribeToEvent(eventName, callback){
        return this.eventProxy.subscribe(eventName, callback);
    }


    /**
     * Registers a hook to the parent plug-in
     * @param {string} hookName - Name of the event
     * @param {function(*): void} callback - Callback to be executed on event
     */
    registerHook(hookName, callback){
        return this.parentObject.hookProxy.registerHook(hookName, callback);
    }

    /**
     * Executes each hook associated with hookName TODO: summarise
     * @param {string} hookName
     * @param {...*} args
     * @return {*} //TODO:fix return type to be a Promise
     */
    executeHook(hookName, args){
        let data = Array.prototype.slice.call(arguments, 1);

        return new Promise((resolve, reject) => {
            this.hookProxy.executeHooks(hookName, data)
                .then((result) =>{
                    if(result.executed){
                        resolve(result);
                    }else{
                        this.parentObject.hookProxy.executeHooks(hookName, data).then(result => {
                            resolve(result);
                        })
                    }
                }, reason => reject(reason))
        })

    }

    databaseClient(dbName, options){
        //Check self
        let databaseResult = this.databaseProxy.databaseClient(dbName, options);
        if(databaseResult.databaseFound){
            return databaseResult.client;
        }
        //Ask parent
        return this.parentObject.propagatedDatabaseClient(dbName, options).client;
    }

    //Called by child plugins, should not be used in code
    propagatedDatabaseClient(dbName, options){
        //Check self
        let databaseResult = this.databaseProxy.databaseClient(dbName, options);
        //Check children
        this.plugins.forEach(plugin => {
            let databaseResult = this.databaseProxy.databaseClient(dbName, options);
            if(databaseResult.databaseFound){
                return databaseResult;
            }
        })
        //Ask parent
        return this.parentObject.propagatedDatabaseClient(dbName, options)
    }



    initialiseDatabase(){
        return new Promise((resolve, reject) => {
            resolve();
        })
    }

    start(){
        return new Promise((resolve, reject) => {
            resolve();
        })
        //TODO: Insert other Default behaviour?
    }

    setup(){
        return new Promise((resolve, reject) => {
            resolve();
        })
    }




}

module.exports = BasePlugIn;