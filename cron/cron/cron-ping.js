const cron                  = require('node-cron');
const fs 					= require('fs');
const scheduleConstants 	= require('./scheduleConstants');

const { Console } 			= require("console");

// make a new logger
const myLogger = new Console({
	stdout: fs.createWriteStream(`./logs/cron-suc-${(new Date()).toISOString().split('T')[0]}.log`),
	stderr: fs.createWriteStream(`./logs/cron-err-${(new Date()).toISOString().split('T')[0]}.log`),
    ignoreErrors: true, 
    colorMode: true
});

const consoleText = () => {

    if (!fs.existsSync('logs')) {
		fs.mkdirSync('logs');
	}

    myLogger.log(`------ CRON START AT ${new Date().toISOString()} ------`);

    myLogger.log('running a task every minute');
    
    myLogger.log(`------ CRON END AT ${new Date().toISOString()} ------`);
}

/* CRON to console.log some Text:- */
cron.schedule(scheduleConstants.EVERY_30_SECONDS, function() {
    consoleText();
});