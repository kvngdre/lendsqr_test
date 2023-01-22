const { createLogger, format, transports } = require('winston');
const { align, combine, printf, timestamp,  } = format;

const Logger = createLogger({
    transports: [
        new transports.File({
            level: 'error',
            filename: 'src/logs/error.log',
            format: combine(
                timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
                align(),
                printf(({ level, label, method, timestamp, message, meta }) => {
                    return `[${level}]:[${label}] -- ${method} -- ${timestamp} -- ${message} -- ${
                        meta ? JSON.stringify(meta) : ''
                    }`;
                })
            ),
            json: true,
        }),
        new transports.Console({
            level: 'info',
            format: format.printf(({level, message}) => `${level}: ${message}...`)
        }),
    ],
});

module.exports = function (filename, method) {
    return Logger.child({ label: filename, method: method });
};
