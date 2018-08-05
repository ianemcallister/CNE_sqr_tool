/*
*	COMMAND LINE INTERFACE
*
*	This is the command line interface for testing out various methods
*/

//declare dependencies
var helper 		= require('./helpers/cli_helpers.js');

var batchRequets = undefined; /*{
	startDate: "",
	endDate: "",
	locations: []
};*/
var pushRequest = {
	entity_id: 'bl6DITWfRLYr2VDl2XnAKQB',
	event_type: 'PAYMENT_UPDATED',
	merchant_id: 'FCGJQY3GC9BNW',
	location_id: 'M53KQT35YKE5C'
};

helper.ops.tx_blocks.update(batchRequets, pushRequest).then(function success(s) {
	console.log('success', s);
}).catch(function error(e) {
	console.log('error', e);
});

//helper.tests.cne_sqr_tx_download();
//cne_sqr_employees_download(status, external_id, limit, order, begin_updated_at, end_updated_at, begin_created_at, end_created_at) 
//helper.tests.cne_sqr_employees_download("ACTIVE");
//helper.tests.cne_sqr_locations_download();



/*helper.customers.season.add("-LG7zzW_hOJLIpxDvPt0", {
	"start_date": "",
	"end_date": "",
	"hrs": {
		"load_in": "",
		"open": "",
		"sales_start": "",
		"sales_end": "",
		"close": "",
		"load_out": ""
	},
	"id": "",
	"name": "2018",
	"no_of_occurances": 0,
	"repeats": "",
	"repeat_on": {
		"mon": false,
		"tue": false,
		"wed": false,
		"thu": false,
		"fri": false,
		"sat": false,
		"sun": false
	}
}).then(function success(s) {
	
	console.log('success', s);
}).catch(function error(e) {
	console.log('error', e);
})*/
