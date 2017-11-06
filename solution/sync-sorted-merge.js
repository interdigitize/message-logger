'use strict'

const {
	addEntryFromEachSourceToCandidates,
	sortCandidates,
	addEntryToPrint,
	printFromQueue,
	confirmLogsAreEmpty
} = require('./util-fns');

module.exports = (logSources, printer) => {
	//logs ready to be printed
	var printQueue = [];
	//recently popped logs that need to be sorted, then added to the print queue
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
		addEntryToPrint(printQueue, printCandidates);
		/* NOTE: addEntryToPrint is a bottleneck. For every iteration through n logs,
		n entries are added as print candidates and only one is moved to the printQueue.
		It doesn't scale well. I am thinking about a way to track what is popped off with each
		iteration through logSources. Then add anything in printCandidates with a date before
		the earliest date of what was most recently popped off to the printQueue.
		*/
		printFromQueue(printQueue, printer);
	}
}

/* NOTE: To cut the time it takes to log entries, I started refactoring to replace the
printCandidates array with a LinkedList. A linkedList will already be sorted after insertion,
which will cut down on processing time. Didn't get to finish it in my scheduled time today.


// function LinkedList(){
// 	this.head = null;
// }
//
// LinkedList.prototype.insert = function(logEntry) {
//   var node = {
//      value: logEntry,
//      next: null
//   }
//   if(!this.head){
//     this.head = node;
//   }
//   else {
//     let current = this.head;
//     while (current.next) {
// 			if (current.value.date < node.logEntry.date){
// 				current = current.next;
// 			} else {
//				//need to finish...
// 			}
//     }
// 		if (current.value.date > node.logEntry.date ) {
// 			let temp = current;
// 			if (current === this.head) {
// 				this.head = node;
// 			}
// 			current = node;
// 			current.next = temp
// 		} else {
// 			current.next = node;
// 		}
//   }
// }
*/
