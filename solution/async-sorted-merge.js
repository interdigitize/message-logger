'use strict'

const P = require("bluebird")

const {
	sortCandidates,
	addEntryToPrint,
	printFromQueue,
	confirmLogsAreEmpty
} = require('./util-fns');

module.exports = (logSources, printer) => {
  console.log('----------------ASYNC-----------------')
	var printQueue = [];
	var printCandidatesPromises = [];
	var printCandidates = []
	var moreToPrint = true;

		function logAsync(){
			logSources.forEach((logEntry, index) => {
				printCandidatesPromises.push(logEntry.popAsync());
			})
			Promise.all(printCandidatesPromises)
			.then((candidates) => {
				candidates.forEach(logEntry => {
					if(logEntry) {
						printCandidates.push(logEntry)
						printCandidatesPromises.shift();
					}
				})
				sortCandidates(printCandidates);
				return printCandidates;
			})
			.then( printCandidates => {
				if (printCandidates.length === 0) {
					moreToPrint = false;
					printer.done()
					return confirmLogsAreEmpty(logSources);
				}
					addEntryToPrint(printQueue, printCandidates);//this is a bottleneck to refactor
					printFromQueue(printQueue, printer);
			})
			.then(() => {
				if(moreToPrint){
					logAsync()
				}
			})
			.catch( err => console.log(err));
		}
		
		logAsync();
}
