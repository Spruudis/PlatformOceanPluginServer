const BasePlugIn = require("../../Plugin APIs/plug-in_base");

class AnonymousMessaging extends BasePlugIn{
    constructor(parentObject) {
        super(parentObject);
        this.eventProxy.subscribe("message", eventProxyResponder => {
            this.eventProxy.emit("message", eventProxyResponder.eventMessage)
        })
    }
}

module.exports = AnonymousMessaging;