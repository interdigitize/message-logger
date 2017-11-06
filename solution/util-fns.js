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
  addEntryToPrint: (queue, candidatePool) => {
    queue.push(candidatePool.shift());
  },
  printFromQueue: (queue, printer) => {
    queue.forEach(logEntry => {
      if (logEntry) {
        printer.print(logEntry);
        queue.shift();
      }
    });
  },
  confirmLogsAreEmpty: (logs) => {
  	logs.map( (logEntry, index) => {
  		if (logEntry.drained) {
  			return console.log(`Everything logged in logSource ${index + 1}`);
  		}
  	})
  }
}
