'use strict'

const {
	addEntryFromEachSourceToCandidates,
	sortCandidates,
	addEntryToPrint,
	printFromQueue,
	confirmLogsAreEmpty
} = require('./util-fns');

module.exports = (logSources, printer) => {
	var printQueue = [];
	var printCandidates = [];
	var moreToPrint = true;

	while (moreToPrint) {
		addEntryFromEachSourceToCandidates(logSources, printCandidates);
		if (printCandidates.length === 0) {
			moreToPrint = false;
			printer.done();
			return confirmLogsAreEmpty(logSources);
 		}
		sortCandidates(printCandidates);
		addEntryToPrint(printQueue, printCandidates); //this is a bottleneck to refactor
		printFromQueue(printQueue, printer);
	}
}
