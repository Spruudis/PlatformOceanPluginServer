const ServerNode = require("./Plugin APIs/ServerNode.js");

const express = require('express');
const http = require('http');
const socketio = require('socket.io');
require('events').EventEmitter.defaultMaxListeners = 50;


const BasePlugIn =  require('./Plugin APIs/plug-in_base.js')


class PlatformOceanServer extends ServerNode{

    #port
    #hostname

    constructor(port, hostname) {
        super();
        this.app = express();
        this.server = http.Server(this.app);
        this.websocket = socketio(this.server);

        this.eventProxy.io = this.websocket;

        this.#port = port;
        this.#hostname = hostname;
        // this._setupServer(port, hostname);

    }

    _setupServer(){

        this.websocket.on('connection', (socket) => {

            //Connection event
            socket.emit('debug message', "Connection established");
            console.log("User connected with socketID:", socket.id);

            //Disconnection event
            socket.on('disconnect', () => {
                console.log('user ' + socket.id + ' disconnected');
                //The event is published if there are any plugins that subscribe to it
            });

            //TODO: make chat a plug-in
            socket.on('chat message', (msg) => {
                this.websocket.emit('chat message', msg);
            });

            socket.on('debug', function(msg){
                socket.emit('debug message', "Server has received YOUR feedback test input", msg);
                console.log(msg);
            });
            //
            // socket.on("clientToServer",function(msg){
            //     console.log('clientToServer:' + msg);
            // });
        });

        this.app.get('/', (req, res) => {
            res.sendFile(__dirname + '/TestingWebsite/index.html');
        });

        this.server.listen(this.#port, ()=>{
            console.log('-----listening on *: ' + this.#port);
            this.eventProxy.publish("Server going live", null);
        });



    }

    registerEventsToNetworkLayer(){
        const setCB = (ev) => {
            this.websocket.on('connection', (socket) => {
                if(!(ev in socket.eventNames())){
                    socket.on(ev, (msg) =>{
                        console.log("--Client publishing ", ev, " to EventProxy--");
                        this.eventProxy.publishFromClient(ev, msg, socket)
                    });
                }
            });
        };

        for (let event in this.eventProxy.subscribers) {
            console.log("-----Registering ", event , " to the network layer");
            setCB(event);
        }

        //open all future subscriptions to the network layer
        this.eventProxy.connectionOpen = true;
    }


    /**
     * Publishes an event occurrence, called by plugins
     * @param {string} eventName - Name of the event
     * @param {EventMsg} msg - Incoming Message
     */
    publishEvent(eventName,msg){
        //TODO: Push to network layer
        this.eventProxy.publish(eventName, msg);

    }

    propagatedDatabaseClient(dbName, options){
        //Check children
        this.plugins.forEach(plugin => {
            let databaseResult = this.databaseProxy.databaseClient(dbName, options);
            if(databaseResult.databaseFound){
                return databaseResult;
            }
        })
        //"Ask" parent - there is no database available to that plug-in, return
        return {
            databaseFound: false,
            client: undefined
        }
    }

    start(){
        //Actions taken with hook, event and database access enabled, before
        console.log("----Starting PlatformOceanServer");
    }

    setup(){
        //Actions taken with hook, event and database access enabled, before
        console.log("----Setting up PlatformOceanServer");
    }


}


module.exports = PlatformOceanServer;

