//-----------------------Imports------------------------
//------------------------------------------------------

//Object passed to Event callbacks to manage network response to clients
class EventProxyResponder{
    #socket
    #io
    #message

    /** @constructor
     * @param {*} message
     * @param {*} socket - TODO: Proper documentation for socketIO types
     * @param {*} io */
    constructor(message, io, socket) {
        this.#socket = socket;
        this.#io = io;
        this.#message = message;
        this.eventProxy = EventProxy.getInstance();
    }

    isExternalCall(){
        if(this.#socket == null)
        {
            return false;
        }
        return true;
    }

    //Contains the message sent with the event. In the context of the
    // web-interface made for presentation purposes, it contains the arguments of the
    // typed command as an array
    get eventMessage(){
        return this.#message;
    }


    //Basic emit. Emits a message to publisher of event, if the publisher is a client and not a plug-in.
    respondToSender(eventName, message){
        if(this.#socket != null){
            this.eventProxy.publishAndEmitToClient(eventName, message, this.#socket.id);
        }
    }

    //Emits a message to all clients in the current socketIO namespace except the sender.
    //TODO: better explanation of namespace, possibly removal if namespaces are not used
    respondAllExceptSender(){
        if(this.#socket != null) {
            this.#socket.broadcast.emit(...arguments);
        }
    }

    get socketID(){
        return this.#socket.id;
    }

}


/**
 * @name EventProxy
 * The event proxy handles the pub/sub model for events. EventProxy is a singleton.
 */
class _EventProxy {
    /**Contains lists of local callbacks subscribed to events*/
    #subscribers
    #io;



    /** @constructor */
    constructor() {
        this.#subscribers = {};
        this.#io = null;

        this.connectionOpen = false;
    }

    /**
     * Adds a callback for an event to a subscriber list
     * @param {string} eventName - Name of the event
     * @param {function(*): void} callback - Callback to be executed on event
     * @return Method to unsubscribe
     */
    subscribe(eventName, callback){
        if (!Array.isArray(this.#subscribers[eventName])) {
            this.#subscribers[eventName] = []
        }
        this.#subscribers[eventName].push(callback)

        const index = this.#subscribers[eventName].length - 1
        let unsubscribed = false;

        //register event to network layer (if it is not). Do not register to network layer while server has not started.
        if(this.connectionOpen){
            this.#io.on('connection', (socket) => {
                if(!(ev in socket.eventNames())){
                    socket.on(eventName, (msg) =>{
                        console.log("--Client publishing ", eventName, " to EventProxy--");
                        this.publishFromClient(eventName, msg, socket)
                    });
                }
            });
        }

        return {
            unsubscribe() {
                if(!unsubscribed){
                    this.#subscribers[eventName].splice(index, 1)
                }
            },
        }
    }

    /**
     * @return Events and their subscribed callbacks
     */
    get subscribers(){
        return this.#subscribers;
    }

    /**
     * Executes each callback subscribed to the event with TODO: the data passed in the event message
     * @param {string} eventName - Name of the event
     * @param {*} msg - Incoming Message
     */

    publish(eventName, msg){
        if (!Array.isArray(this.#subscribers[eventName])) {
            return
        }
        const epr = new EventProxyResponder(msg, this.#io, null);

        this.#subscribers[eventName].forEach((callback) => {

            setTimeout(() => {callback(epr)}, 0);
        })
    }

    /**
     * Emits a message to all connected clients.
     * @param {string} eventName - Name of the event
     * @param {*} message - Incoming Message
     */
    emit(eventName, message){
        if(this.#io != null){
            this.#io.emit(eventName, message);
        }
    }

    /**
     * Emits a message to a specific client.
     * @param {string} eventName - Name of the event
     * @param {*} message - Message
     * @param {string} socketID - Id of the client connection
     */
    emitToClient(eventName, message, socketID){
        if(this.#io != null){
            this.#io.to(socketID).emit(eventName, message);
        }
    }

    /**
     * Executes each callback subscribed to the event with TODO: the data passed in the event message
     * and emits a message to all connected clients.
     * @param {string} eventName - Name of the event
     * @param {*} msg - Incoming Message
     */
    publishAndEmit(eventName, message){
        this.publish(eventName, message);
        this.emit(eventName, message);
    }

    publishAndEmitToClient(eventName, message, socketID){
        this.publish(eventName, message);
        this.emitToClient(eventName, message, socketID);
    }




    //TODO: remove plug-in access
    publishFromClient(eventName, msg, socket){

        if (!Array.isArray(this.#subscribers[eventName])) {
            socket.emit('debug message', eventName + " is not a recognised command");
            return
        }


        //Option 1: Bind this to refer to _EventProxyInternal{}
        //-Not sure this is helpful
        //
        // subscribers[eventName].forEach((callback) => {
        //     console.log("This in publishFromClient subscribers[eventName].forEach(): " , this);
        //     callback = callback.bind(this);
        //     callback(msg);
        // })

        //Option 2: Pass socket to the callback
        //-Eliminates API restrictions giving full access to network layer
        //-If socketIO updates, all plugins have to update how they interact with the socket,
        // not just the server/EventProxy
        //-

        //Option 3: EventProxyResponder object to handle interaction
        const epr = new EventProxyResponder(msg, this.#io, socket);
        this.#subscribers[eventName].forEach((callback) => {
            callback(epr);
        })

    }

    /**
     * Sets the SocketIO object to be used when emitting events
     * @param {Server} websocket
     */
    set io(websocket) {
        this.#io = websocket;
    }

}









/**
 * @name EventProxy
 * The event proxy handles the pub/sub model for events. EventProxy is a singleton.
 */
const EventProxy = (function () {
    let EventProxyInstance;

    function createInstance() {
        let object = new _EventProxy();
        return object;
    }

    return {
        getInstance: function () {
            if (!EventProxyInstance) {
                EventProxyInstance = createInstance();
            }
            return EventProxyInstance;
        }
    };
})();


module.exports = EventProxy;


