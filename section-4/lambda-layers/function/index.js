const logger = require('/opt/nodejs/index.js');
const moment = require('moment');

exports.handler = async (event, context) => {
    const message = logger.write(`Hello Cloud Gurus! Happy ${moment().format('dddd')}`);
    console.log(message);
    return message;
};