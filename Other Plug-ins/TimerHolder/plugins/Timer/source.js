const BasePlugIn = require("../../../../Plugin APIs/plug-in_base");


class Timer extends BasePlugIn{
    constructor(parentObject) {
        super(parentObject);
        this.registerHook("setTimer", (data) => {
            setInterval(() => {
                this.publishEvent(data[0].eventName, null);
                console.log("Timer publishing event: " + data[0].eventName + " at frequency: " + data[0].timerFrequency + "s")
            }, data[0].timerFrequency*1000);
            return data;
        })
    }

    start(){
        console.log("----Starting TimerPlugIn");
    }

}

module.exports = Timer;