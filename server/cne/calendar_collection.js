/*
*	AH-NUTS / CAPITALIST NUT ENTERPRISES:
*	MAINTENANCE: SALES DAYS COLLECTION
*
*	This module...
*/

//define dependencies
var firebase		= require('../firebase/firebase.js');

//define local variables
var calendar = {
	update: {
		sales_days: update_salesdays
	},
	test: test
};

/*
*	UPDATE CALENDAR SALESDAYS
*
*	This function run through all the sales days and makes sure they're on the
*	calendar.
*/
//TODO: THIS IS PRODUCING ALTERNATING RESULTS EACH TIME IT RUNS.  THE GOOD NEWS IS THAT
//IT CORRECTS ITSELF EACH TIME AROUND, THE BAD NEWS IS THAT IT IS ACTING WEIRD
function update_salesdays() {
	//define local variables
	var allPromises = [firebase.read('sales_days'), firebase.read('calender')]

	//return async work
	return new Promise(function(resolve, reject) {

		//resolve promises
		Promise.all(allPromises)
		.then(function success(s){ 
			//define local varables
			var allSalesDays = s[0];
			var theCalendar = s[1];
			var updatePath = "calender/";
			var updateObject = {};
			var theYear = "";

			//	1. ITERATE THROUGH ALL THE SALES DAYS
			Object.keys(allSalesDays).forEach(function(salesDayKey) {

				//define local variables
				var theDate = allSalesDays[salesDayKey].date;
				theYear = theDate.split('-')[0];;

				//	2. CLEAR OUT ANY PLACEHOLDERS, OLD, OR EXCESS DATA
				var aCalendarDay = theCalendar[theYear][theDate];
				
				//Iterate through all the keys for each calendar day
				Object.keys(aCalendarDay).forEach(function(key) {

					//	2.1 MAKE SURE ONLY DESIRED FIELDS ARE PRESENT
					if(key != "wk_num" && key != "wkday" && key != "sales_days") {
						//define local variables
						var oldUpdatePath = theDate;

						//if a key other than the expected keys is present, nullify it
						var keySegment = "/" + key;
						oldUpdatePath =+ keySegment;

						//add the path to the values being nullified
						updateObject[oldUpdatePath] = null;
					}

					//	2.2 MAKE SURE ANY PLACEHOLDERS AND OLD DATA ARE REMOVED
					if(key == 'sales_days') {

						//define local variables
						var calendarDateSalesDays = aCalendarDay.sales_days;

						//iterate over old sales days keys
						Object.keys(calendarDateSalesDays).forEach(function(aCalDateSalesDayKey) {
							//define local variables
							var oldUpdatePath = theDate;
							var keySegment = "/sales_days/" + aCalDateSalesDayKey;
							oldUpdatePath += keySegment;

							updateObject[oldUpdatePath] = null;
						});

					}

				});

				//	3. ADD THE NEW PATH TO THE UPDATE OBJECT
				var newUpdatePath = theDate + "/sales_days/" + salesDayKey;
				var cme_name = allSalesDays[salesDayKey].cme_name;
				updateObject[newUpdatePath] = cme_name;

				//notify of the progress
				console.log(cme_name, salesDayKey);

			});
	
			//	4. WAIT FOR ALL THE UPDATES TO THE DATABASE TO RETURN
			updatePath += theYear;
			//resolve(updateObject);
			firebase.update(updatePath, updateObject)
			.then(function success(ss) {
				resolve(ss);
			}).catch(function error(ee){
				reject(ee);
			});


		}).catch(function error(e){
			reject(e);
		});

	});

};

/*
*	TEST
*
*	This is used to test the module
*/
function test() { return('testing calendar module'); }

//return the module
module.exports = calendar;

