const cron                  = require('node-cron');
const scheduleConstants 	= require('./scheduleConstants');

const consoleText = () => {
    console.log(`------ CRON START AT ${new Date().toISOString()} ------`);

    console.log('running a task every minute');
    
    console.log(`------ CRON END AT ${new Date().toISOString()} ------`);
}

/* CRON to console.log some Text:- */
cron.schedule(scheduleConstants.EVERY_30_SECONDS, function() {
    consoleText();
});