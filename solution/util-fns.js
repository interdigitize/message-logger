'use strict'

module.exports = {
  addEntryFromEachSourceToCandidates: (logs, queue) => {
    logs.forEach( logSource => {
      if (logSource.pop()){
        queue.push(logSource.pop());
      }
    });
  },
  sortCandidates: (arr) => {
		arr = arr.sort( function(a, b) {
			return a.date - b.date;
		});
	},
  addEntryToPrint: (printQueue, candidates) => {
    printQueue.push(candidates.shift());
  },
  printFromQueue: (queue, printer) => {
    queue.forEach(logEntry => {
      if (logEntry) {
        printer.print(logEntry);
        queue.shift();
      }
    });
  },
  confirmLogsAreEmpty: (logSources) => {
  	logSources.map( (logEntry, index) => {
  		if (logEntry.drained) {
  			return console.log(`Everything logged in logSource ${index + 1}`);
  		}
  	})
  }
}
