const cron = require('node-cron');

// ...

// Schedule tasks to be run on the server.
cron.schedule('* * * * *', function() {
    console.log('running a task every minute');
});