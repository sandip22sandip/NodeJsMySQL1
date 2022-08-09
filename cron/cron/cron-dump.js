const cron                  = require('node-cron');
const shell                 = require('shelljs');
const scheduleConstants 	= require('./scheduleConstants');

const executeShell = () => {
    console.log(`------ CRON START AT ${new Date().toISOString()} ------`);

    if (shell.exec('mysqldump -hlocalhost -udbroot -pmysqldba propacademy > propacademy.sql').code !== 0) {
      shell.exit(1);
    }else {
      shell.echo('Excecuted Shell Command.');
    }

    console.log(`------ CRON END AT ${new Date().toISOString()} ------`);
}

/* CRON to Excecuted Shell Command:- */
cron.schedule(scheduleConstants.EVERY_MINUTE, function() {
    executeShell();
});