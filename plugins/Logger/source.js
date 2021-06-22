const winston = require('winston')
const path = require('path');
const basePath = path.join(process.cwd(),"Plugin APIs/plug-in_base")
const BasePlugIn = require(basePath);


dateFormat = () => {
    return new Date(Date.now()).toUTCString()
}
class Logger extends BasePlugIn{
    constructor(parentObject) {
        super(parentObject);
        this.log_data = null
        const route = "app";

        const logger = winston.createLogger({

            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: `./logs/${route}.log`
                })
            ],
            format: winston.format.printf((info) => {
                let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${route}.log | ${info.message} | `
                message = info.obj ? message + `data:${JSON.stringify(info.obj)} | ` : message
                message = this.log_data ? message + `log_data:${JSON.stringify(this.log_data)} | ` : message
                return message
            })
        });
        this.logger = logger
    }

    setup(){

        this.subscribeToEvent('logInfo', eventProxyResponder => {
            this.info(eventProxyResponder.eventMessage.msg, eventProxyResponder.eventMessage.data)
        })

        this.subscribeToEvent('logDebug', eventProxyResponder => {
            this.debug(eventProxyResponder.eventMessage[0], eventProxyResponder.eventMessage[1])
        })

        this.subscribeToEvent('logError', eventProxyResponder => {
            this.error(eventProxyResponder.eventMessage[0], eventProxyResponder.eventMessage[1])
        })

    }

    setLogData(log_data) {
        this.log_data = log_data
    }
    async info(message) {
        this.logger.log('info', message);
    }
    async info(message, obj) {
        this.logger.log('info', message, {
            obj
        })
    }
    async debug(message) {
        this.logger.log('debug', message);
    }
    async debug(message, obj) {
        this.logger.log('debug', message, {
            obj
        })
    }
    async error(message) {
        this.logger.log('error', message);
    }
    async error(message, obj) {
        this.logger.log('error', message, {
            obj
        })
    }
}

module.exports = Logger