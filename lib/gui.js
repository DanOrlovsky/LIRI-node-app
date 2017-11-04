var sleep = require('system-sleep');

function writeText(text) {
    
    for(var i=0;i<text.length;i++) {
        process.stdout.write(text[i]);
        sleep(5);
    }
}

module.exports = {
    writeText: writeText,
}