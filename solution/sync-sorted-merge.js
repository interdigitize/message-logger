'use strict'

module.exports = (logSources, printer) => {
	var printQueue = [];
	var printCandidates = [];
	var moreToPrint = true;

	while (moreToPrint) {
		addCandidateLogEntries(logSources);
		if (printCandidates.length === 0) {
			moreToPrint = false;
			printer.done();
			logSources.map( (logEntry, index) => {
				if (logEntry.drained) {
					return console.log(`Everything logged in logSource ${index + 1}`);
				}
			})
		}
		if (moreToPrint) {
			sortCandidates(printCandidates);
			printQueue.push(printCandidates.shift()); //this is a bottleneck to refactor
			checkPrintQueue(printQueue);
		}
	}

	function sortCandidates(arr) {
		arr = arr.sort( function(a, b) {
			return a.date - b.date;
		});
	}

	function checkPrintQueue(queue) {
		queue.forEach(logEntry => {
			if (logEntry) {
				printer.print(logEntry);
				printQueue.shift();
			}
		});
	}

	function addCandidateLogEntries(logs) {
		logs.forEach( logSource => {
			if (logSource.pop()){
				printCandidates.push(logSource.pop());
			}
		});
	}
}
