/*
*	COMMAND LINE INTERFACE
*
*	This is the command line interface for testing out various methods
*/

//declare dependencies
var helper 		= require('./helpers/cli_helpers.js');

helper.ops.sales_days.repair.ids().then(function success(s) {
	console.log('success', s);
}).catch(function error(e) {
	console.log('error', e);
});

/*var batchRequets = undefined; {
	startDate: "",
	endDate: "",
	locations: []
};

helper.ops.tx_blocks.update(batchRequets, pushRequest).then(function success(s) {
	console.log('success', s);
}).catch(function error(e) {
	console.log('error', e);
});*/

