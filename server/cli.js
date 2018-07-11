/*
*	COMMAND LINE INTERFACE
*
*	This is the command line interface for testing out various methods
*/

//declare dependencies
//var cne				= require('./cne/cne.js');
//var mysql 			= require('./mysql/mysql_api.js');
//var square 			= require('./square/sqr_api.js');
//var templatizer 	= require('./template_engine/templateizer.js');
var stdio			= require('./stdio/stdio_api.js');
//var sqrdata			= require('./square/sqr_data_api.js');
//var locations_mysql = require('./mysql/query_builder.js');
var squareV1		= require('./square/v1_api.js');
var ahnutsSqSync	= require('./square/ahnuts_sqr_tx_sync.js');
var firebase		= require('./firebase/firebase.js');
//var customerFns		= require('./cne/ahnuts_customers_fn.js'); 
//var salsesdaysFns	= require('./cne/ahnuts_sales_days_fn.js'); 
var cme				= require('./cne/cme_maintenance.js'); 
var calendarFns		= require('./cne/ahnuts_calender_fn.js'); 
var txFns			= require('./cne/ahnuts_transactions_fn.js');

squareV1.payments.list('M53KQT35YKE5C', '2018-01-01T00:00:00Z', '2018-05-03T00:00:00Z').then(function success(s) {
	console.log('success', s.length);
}).catch(function error(e) {
	console.log("error", e);
})



/*var tx_date = "2018-07-10";
var emp_id = "xQjIXzpdO_xAivh-9e9F";
var writePath = 'reference_lists/CME_by_employee_and_date/' + tx_date + "/" + emp_id;

firebase.create(writePath, { 0: { "is_known": true, customer:"-LG7zzWIARLFo9__SwdR", salesDay:"-LGW8Fd1qcPdVXaEJaoJ"}}).then(function success(s) {
	console.log("success", s);
}).catch(function error(e) {
	console.log("error", e)
});*/


//ahnutsSqSync.single_tx_sync('TdeA1fel6UysVdEGFH5rKQB', 'M53KQT35YKE5C');


//cme.calculate.salesday_summary('-LGW19FaJ-c3p8FzuVJo');


//calendarFns.sync.sales_days_to_calendar();

//txFns.batch.move_txs('sales_days/-LGW6w5gsL1Kff8Gt2MB /transactions', 'sales_days/-LGW6w5gsL1Kff8Gt2MB/transactions');


//cme.sync.sales_days_to_customers();


/*var known_cme_object = cme.check.known_cme( {
	JAMRfRgDpZvisJ8n6DvXLQB: {
		created_at: "2018-07-02T17:38:43-07:00",
		employee_id: "4ISdMmC7SkAyDQL_DB87"
	}
}).then(function success(s) {
	console.log("success", s);
}).catch(function error(e) {
	console.log("error", e)
});*/



//customerFns.add.customers(stdio.read.json('./models/customers.json'));

/*var newArray = salsesdaysFns.compile.new_sales_days_batch({
		customer: "Beaverton",
		season: "2018_Summer",
		bookend_dates: {
			first: "2018-05-05",
			last: "2018-09-29"
		},
		repeats: "every_week",
		event_days: {
			0: false,
			1: false,
			2: false,
			3: false,
			4: false,
			5: false,
			6: true
		},
		same_day_load_in_out: true,
		schedule: {
			load_in: "2018-05-05T06:00:00-07:00",
			load_out: "2018-05-05T14:30:00-07:00",
			open: "2018-05-05T06:00:00-07:00",
			close: "2018-05-05T14:30:00-07:00",
			sales_start: "2018-05-05T08:00:00-07:00",
			sales_end: "2018-05-05T13:30:00-07:00"
		}
	});*/

//console.log(newArray);


//var calObject = calendarFns.add.date_range("2018-01-01", "2018-12-31");

/*firebase.create('calender/2018', calObject).then(function success(s) {
	console.log('success', s);
}).catch(function error(e) {
	console.log("error", e);
})*/

//ahnutsSqSync.push_requests({ entity_id: 'PzGUikmYpROMkDuGal6XLQB', event_type: 'PAYMENT_UPDATED', merchant_id: 'FCGJQY3GC9BNW', location_id: 'M53KQT35YKE5C' });


