var fs = require('fs');




function LogAction(action, text) {
    var dateTime = new Date();
    var textToWrite = `Logged ${ action } activity on ${ dateTime }\n${text}\n\n`;
    fs.appendFile('./log.txt', textToWrite, function(err) {
        if(err) {
            console.log('There was an error writing to the log file.');
            console.log(err);
        }
    })
}

module.exports = { 
    LogAction
};