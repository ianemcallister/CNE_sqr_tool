/*
*	COMMAND LINE INTERFACE
*
*	This is the command line interface for testing out various methods
*/

//declare dependencies
var helper 		= require('./helpers/cli_helpers.js');

/*helper.calender.update.sales_days().then(function success(s) {
	console.log('success', s);
}).catch(function error(e) {
	console.log('error', e);
});*/

var batchRequets = true; /*{
	startDate: "2018-08-05T00:00:00-07:00",
	endDate: "2018-08-05T23:59:59-07:00",
	locations: ['M53KQT35YKE5C']
};*/
var pushRequest = undefined; /*{
 	entity_id: 'bl6DITWfRLYr2VDl2XnAKQB',
 	event_type: 'PAYMENT_UPDATED',
 	merchant_id: 'FCGJQY3GC9BNW',
 	location_id: 'M53KQT35YKE5C'
 };*/

helper.ops.tx_blocks.update(batchRequets, pushRequest).then(function success(s) {
	console.log('success');
}).catch(function error(e) {
	console.log('error', e);
});
