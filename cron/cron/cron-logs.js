const cron  				= require('node-cron');
const fs 					= require('fs');
const scheduleConstants 	= require('./scheduleConstants');

const generateReport = (interval = '') => {
	console.log(`------ CRON END AT ${new Date().toISOString()} ------`);
	
	if (!fs.existsSync('logs')) {
		fs.mkdirSync('logs');
	}

	const existingReports 	= fs.readdirSync('logs');
	const reportsOfType 	= existingReports?.filter((existingReport) => existingReport.includes(interval));
	fs.writeFileSync(`logs/${interval}_${new Date().toISOString()}.txt`, `Existing Reports: ${reportsOfType?.length}`);

	console.log(`------ CRON END AT ${new Date().toISOString()} ------`);
};

/* CRON to Generate Reports:- */
cron.schedule(scheduleConstants.EVERY_30_SECONDS, () => {
	generateReport('thirty-seconds');
});

cron.schedule(scheduleConstants.EVERY_MINUTE, () => {
	generateReport('minute');
});

cron.schedule(scheduleConstants.EVERY_30_MINUTES, () => {
	generateReport('thirty-minutes');
});

cron.schedule(scheduleConstants.EVERY_HOUR, () => {
	generateReport('hour');
});
