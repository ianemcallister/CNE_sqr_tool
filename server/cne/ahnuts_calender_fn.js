/*
*	AHNUTS CALENDAR FUNCTIONS
*
*	This is the Ah-nuts calendar functions method
*/

//define dependencies
var firebase		= require('../firebase/firebase.js');
var stdio			= require('../stdio/stdio_api.js');
var moment 			= require('moment-timezone');

//config
//moment().format();

//define module
var ahcalfn = {
	compile: {
		season_sales_days_list: season_sales_days_list
	},
	add: {
		date_range: add_date_range,
		season_sales_days: add_season_sales_days
	},
	sync: {
		sales_days_to_calendar: sync_sales_days_to_calendar
	}
};

// 	COMPILE SEASON SALES DAYS LIST
function season_sales_days_list(start_date, end_date, frequency, rpt_on, hrs) {
	//define local variables
	var frequency_hash = { "never":0 , "every_week": 1, "every_2_weeks": 2, "every_3_weeks": 3, "every_4_weeks": 4, "every_5_weeks": 5, "every_6_weeks": 6, "every_7_weeks": 7, "every_8_weeks": 8 };

};

//	ADD DATE RANGE
function add_date_range(start, end) {
	//define local varaiables
	var startDate = moment(start);
	var endDate = moment(end);
	var newCalendar = {};

	while(startDate.format() <= endDate.format()) {

		var currentDatetime = startDate.format();
		var splitTime = currentDatetime.split("T");

		newCalendar[splitTime[0]] = {
			wk_num: startDate.week(),
			wkday: startDate.format("dddd"),
			sales_days: { "placeholder": "placeholder" },
		};

		startDate.add(1, "days");
		//console.log(startDate.format());
	}
	
	return newCalendar;
};

//	ADD SEASON SALES DAYS
function add_season_sales_days() {};

//	SYNC SALES DAYS TO CALENDAR
function sync_sales_days_to_calendar() {
	//define local variables
	var sales_days_list = [];

	//download full sales_days list
	firebase.read('sales_days').then(function success(s) {
		
		// save the list
		sales_days_list = s;

		//iterate through the list
		Object.keys(sales_days_list).forEach(function(key) {
			
			var pushPath = 'calender/2018/' + sales_days_list[key].date + "/sales_days";
			//calender[sales_days_list[key].date].sales_days
			firebase.push(pushPath, key);
			
			console.log(key, 'written');

		});


	}).catch(function error(e) {
		console.log("error", e);
	});
}

//return the module
module.exports = ahcalfn;

