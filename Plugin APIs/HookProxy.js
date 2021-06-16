//-----------------------Imports------------------------
//-----------------------------------------------------

/**
 * @name HookProxy
 * The event proxy handles the pub/sub model for events. EventProxy is a singleton.
 */
class HookProxy {

    #registeredHooks;

    /** @constructor */
    constructor() {
        this.#registeredHooks = {};
    }

    /**
     * Registers a hook (callback) associated with hookName
     * @param {string} hookName - Name of the event
     * @param {function(*): void} callback - Callback to be executed on event
     */
    registerHook(hookName, callback){
        if (!Array.isArray(this.#registeredHooks[hookName])) {
            this.#registeredHooks[hookName] = []
        }
        this.#registeredHooks[hookName].push(callback)
        //console.log("registered a hook");

        const index = this.#registeredHooks[hookName].length - 1
        let unsubscribed = false;
        let unsub = () => {
            this.#registeredHooks[hookName].splice(index, 1)
        }

        return {
            unsubscribe() {
                if(!unsubscribed){
                    unsub();
                }
            },
        }
    }

    //TODO: define input/return object which contains: hook name, original data, result, isCumulitative

    /**
     * Executes each hook associated with hookName in registration order
     * @param {string} hookName
     * @param {array} data
     * @return {*} //TODO:fix
     */
    executeHooks(hookName, data){

        if (!Array.isArray(this.#registeredHooks[hookName])) {
            //TODO: define type
            //console.log("executeHooks: " + hookName +  " --- No hooks found");
            return Promise.resolve({
                result: data,
                executed: false
            })
        }

        let resultPromise = this.#registeredHooks[hookName].reduce( (arg, hookFn) =>{
            return Promise.resolve(hookFn(arg));
        }, data);

        return resultPromise.then((result)=>{
            return{
                result: result,
                executed: true
            }
        })

    }

};

module.exports = HookProxy;