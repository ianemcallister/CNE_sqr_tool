/*
*	AHNUTS SALE DAYS FUNCTIONS
*
*	This is the Ah-nuts sales days functions method
*/

//define dependencies
//var firebase		= require('../firebase/firebase.js');
//var stdio			= require('../stdio/stdio_api.js');
var moment 			= require('moment-timezone');

//define module
var ahsdfn = {
	build: build_sales_day_object,
	compile: {
		new_sales_days_batch: compile_new_sales_days_batch
	},
	test: test
};

//	BUILD SALES DAY OBJECT 
function build_sales_day_object(date, instance, params) {
	//define local variables

	var salesdayObject = {
		id: "",
		date: moment(date).format('YYYY-MM-DD'),
		wk_day: moment(date).format('ddd'),
		customer_name: params.customer,
		customer_id: params.customer_id,
		season_id: params.season,
		cme_name: params.customer + "_" + params.season + "_" + instance,
		hrs: {
			labor_total: 0,
			labor_reg: 0,
			labor_ot: 0,
			sales_total: 0 
		},
		schedule: {
			load_in: moment(date).hour(moment(params.schedule.load_in).hour()).minute(moment(params.schedule.load_in).minute()).format(),
			load_out: moment(date).hour(moment(params.schedule.load_out).hour()).minute(moment(params.schedule.load_out).minute()).format(),
			open: moment(date).hour(moment(params.schedule.open).hour()).minute(moment(params.schedule.open).minute()).format(),
			close: moment(date).hour(moment(params.schedule.close).hour()).minute(moment(params.schedule.close).minute()).format(),
			sales_start: moment(date).hour(moment(params.schedule.sales_start).hour()).minute(moment(params.schedule.sales_start).minute()).format(),
			sales_end: moment(date).hour(moment(params.schedule.sales_end).hour()).minute(moment(params.schedule.sales_end).minute()).format()
		},
		scheduled_shifts: {
			0: "placeholder"
		},
		devices: {
			0: "placeholder"
		},
		team_members: {
			0: "placeholder"
		},
		transactions: {
			0: "placeholder"
		},
		"financial_summary": {
			"gross_sales": 0,
			"refunds": 0,
			"net_gross_sales": 0,
			"discounts": 0,
			"tips": 0,
			"no_of_tx": 0,
			"rent_paid": {
				"date_time": "",
				"amount": 0,
				"by": "",
				"type": "CASH",
				"account": ""
			},
			"pay_method_breakdown": {
				"cash": 0,
				"credit": 0,
				"other": 0,
				"tokens": 0
			},
			"change_banks":{
				"no_provided": 0,
				"cash_value_provided": 0,
				"no_used": 0,
				"cash_value_used": 0
			},
			"tokens": { 0: "placeholder" },
			"labor": { 0: "placeholder" },
			"commissions": { 0: "placeholder" },
			"power": { 0: "placeholder" },
			"parking": { 0: "placeholder" },
			"cash_drawers": { 0: "placeholder" },
			"expected_payments": { 0: "placeholder" }
		},
		"mfg_summary": {
			0: "placeholder"
		},
		"product_sales_summary": {
			0: "placeholder"
		},
		"raw_resources": {
			0: "placeholder"
		}
	};

	//calculate labor total hrs
	var labor_start = new moment(salesdayObject.schedule.open);
	var labor_finish = new moment(salesdayObject.schedule.close);
	salesdayObject.hrs.labor_total = moment.duration(labor_finish.diff(labor_start)).asMinutes() / 60;

	//calculate regular and OT
	if(salesdayObject.hrs.labor_total > 8) {
		salesdayObject.hrs.labor_reg = 8;
		salesdayObject.hrs.labor_ot = salesdayObject.hrs.labor_total - 8;
	} else {
		salesdayObject.hrs.labor_reg = salesdayObject.hrs.labor_total;
	};

	//calculate sales hours
	var sales_start = new moment(salesdayObject.schedule.sales_start);
	var sales_finish = new moment(salesdayObject.schedule.sales_end);
	salesdayObject.hrs.sales_total = moment.duration(sales_finish.diff(sales_start)).asMinutes() / 60;


	return salesdayObject;
}

//	COMPILE NEW SALES DAYS BATCHC
function compile_new_sales_days_batch(params) {
	//define local variables
	var returnArray = [];
	var frequency_hash = { "never":0 , "every_week": 1, "every_2_weeks": 2, "every_3_weeks": 3, "every_4_weeks": 4, "every_5_weeks": 5, "every_6_weeks": 6, "every_7_weeks": 7, "every_8_weeks": 8 };
	var frequency_number = frequency_hash[params.repeats];
	var valid_wkdays = params.event_days;
	var instance = 0;

	//bookend dates
	var start = moment(params.bookend_dates.first);
	var end = moment(params.bookend_dates.last);

	//weeks
	var start_wk = start.isoWeek();
	var end_wk = end.isoWeek();

	//cursor
	var cursor = start
	
	//notify of progress
	//console.log('got these params');
	//console.log('start.format()', start.format());
	//console.log('end.format()', end.format());
	//console.log('start_wk', start_wk);
	//console.log('end_wk', end_wk);
	//console.log('frequency_number', frequency_number);

	//iterate through
	while(cursor.valueOf() <= end.valueOf()) {
		//define local variables
		var current_wk = cursor.isoWeek();
		var current_wkday = cursor.format('ddd');
		var good_wk = ((current_wk - start_wk) % frequency_number) == 0;
		var good_day = valid_wkdays[current_wkday];

		//notify of progress

		//console.log(cursor.format(), current_wk, current_wkday, 'good_wk:', good_wk, 'good_day', good_day, 'current_wkday', current_wkday);

		//confirm validity of date, if so incriment the instance and save the params
		if(good_day && good_wk) {
			//save the params
			returnArray.push(build_sales_day_object(cursor.format(), instance, params));
			//incriment the instance
			instance++;
		}

		//incriment the counter
		cursor.add(1, 'days');
	}

	//console.log('return Array', returnArray);

	return returnArray;

};

//	TEST
function test() { console.log('testing Sales Day Functions'); }

//return the module
module.exports = ahsdfn;

