/*
*	AH-NUTS / CAPITALIST NUT ENTERPRISES:
*	MAINTENANCE: TRANSACTIONS COLLECTION DATA FORMATTING
*
*	This module...
*/

//define dependencies

//define module
var data_formatting = {
	parse: {
		last_batch_sync: format_sync_log
	},
	test: test
};

/*
*	FORMAT SYNC LOG
*
*	This function formats the log object returned from fire base.  It returns a string
*
*	@param - logObjectPromise { (key):{ timestamp: "1980-01-01T00:00:00Z", successful: true } }
* 	@return - returnDate [string] i.e. "1980-01-01T00:00:00Z"
*/
function format_sync_log(logObjectPromise) {
	//define local variables
	var returnDate = new Date('1980-01-01T00:00:00Z');
	
	//return async work
	return new Promise(function(resolve, reject) {

		//wait for promise to resolve
		logObjectPromise.then(function success(s) {

			//iterate through the list, find the most recent one, keep it
			Object.keys(s).forEach(function(key) {

				var newDate = new Date(s[key].timestamp);

				if(newDate > returnDate) returnDate = newDate
				
			});

			//return the newest date
			resolve(returnDate);

		});

	});

};

/*
*	TEST
*
*	This is used to test the module
*/
function test() { console.log('testing transaction data formating module'); }

//return the module
module.exports = data_formatting;


