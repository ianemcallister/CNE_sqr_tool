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
	compile: {
		new_sales_days_batch: compile_new_sales_days_batch
	},
	test: test
};

//	BUILD SALES DAY OBJECT 
function build_sales_day_object(date, instance, params) {
	//define local variables

	var salesdayObject = {
		date: moment(date).format('YYYY-MM-DD'),
		wk_day: moment(date).format('ddd'),
		id: params.customer + "_" + params.season + "_" + instance,
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
	//console.log('got these params', start.format(), end.format(), start_wk, end_wk, frequency_number);

	//iterate through
	while(cursor.valueOf() <= end.valueOf()) {
		//define local variables
		var current_wk = cursor.isoWeek();
		var current_wkday = cursor.weekday();
		var good_wk = ((current_wk - start_wk) % frequency_number) == 0;
		var good_day = valid_wkdays[current_wkday];

		//notify of progress

		//console.log(cursor.format(), current_wk, current_wkday, 'good_wk:', good_wk, 'good_day', good_day);

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

	return returnArray;

};

//	TEST
function test() { console.log('testing Sales Day Functions'); }

//return the module
module.exports = ahsdfn;

