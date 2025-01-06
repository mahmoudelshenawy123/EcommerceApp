const { createLogger ,format ,transports } = require('winston')

const logger = createLogger({
    transports:[
        new transports.Console(),
        new transports.File({
            filename: 'logs/error.log', 
            level: 'error' ,
            format: format.combine(format.timestamp(),format.json())
        }),
        new transports.File({
            filename: 'logs/combined.log' ,
            format: format.combine(format.timestamp(),format.json())
        }),

    ]
})
module.exports ={logger}