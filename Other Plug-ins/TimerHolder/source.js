const BasePlugIn = require("../../Plugin APIs/plug-in_base");


class TimerHolder extends BasePlugIn{
    constructor(parentObject) {
        super(parentObject);
        this.tick = 0;
        const timerFrequency = 10;
        this.timerFrequency = timerFrequency;
        this.subscribeToEvent("myTimer1", (eventProxyResponder) => {
            this.tick++;
            let msg = 'Tick ' + this.tick;
            this.eventProxy.publishAndEmit('chat message', msg)

        })

        this.subscribeToEvent("feedbackTest", function(eventProxyResponder){
            // this.websocket.emit('debug message',"Plug-in has received a feedback test input")
            eventProxyResponder.respondToSender('debug message', "Plug-in has received YOUR feedback test input of " +
                eventProxyResponder.eventMessage);
            console.log("--Received input--")
        })
    }

    start(){
        return new Promise((resolve,reject)=>{
            console.log("----Starting TimerHolder");
            this.executeHook("setTimer", {eventName: "myTimer1", timerFrequency: this.timerFrequency})
                .then(result => {
                    resolve();
                }, reason => reject(reason))
        })

    }
}

module.exports = TimerHolder;