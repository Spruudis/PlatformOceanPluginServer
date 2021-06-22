const path = require('path');
const basePath = path.join(process.cwd(),"Plugin APIs/plug-in_base")
const BasePlugIn = require(basePath);


class AnonymousMessaging extends BasePlugIn{
    constructor(parentObject) {
        super(parentObject);
        this.eventProxy.subscribe("message", eventProxyResponder => {
            this.eventProxy.emit("message", eventProxyResponder.eventMessage)
        })
    }
}

module.exports = AnonymousMessaging;