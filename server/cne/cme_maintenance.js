/*
*	AHNUTS CME FUNCTIONS
*
*	This is the Ah-nuts calendar functions method
*/

//define dependencies
var firebase		= require('../firebase/firebase.js');
var stdio			= require('../stdio/stdio_api.js');

//define module
var cme_maintenance = {
	check: {
		known_cme: check_known_cme
	},
	sync: {
		sales_days_to_customers: sync_sales_days_to_customers
	},
	test: test
};

//everytime a transaction comes in it should be sorted

//	CHECK KNOWN CME
function check_known_cme(ahnuts_tx) {
	//define local variables
	var known_cme_object = {
		is_known: false,
		customer: "",
		salesDay: ""
	};
	var tx_date = (ahnuts_tx.created_at.split("T"))[0];
	var emp_id = ahnuts_tx.employee_id;
	var readpath = 'reference_lists/CME_by_employee_and_date/' + tx_date + "/" + emp_id;

	console.log(readpath);

	//return async work
	return new Promise(function(resolve, reject) {

		//collect the reference from the db
		firebase.read(readpath).then(function success(s) {

			//iterate through all entries
			Object.keys(s).forEach(function(key) {
				
				//if is known, add the data
				if(s[key].cme_confirmed) {
					known_cme_object.is_known = true;
					known_cme_object.customer = s[key].customer_id;
					known_cme_object.salesDay = s[key].cme_id;
				}

			});

			resolve(known_cme_object);

		}).catch(function error(e) {
			reject('an error occured', e);
		});


	});


};

//	SYNC SALES DAYS TO CUSTOMERS
function sync_sales_days_to_customers() {
	//define local variables
	var returnObject = {};
	var customerKey = {
		Beaverton: "-LG7zzW70_MpqTB6ozkb",
		"Aloha FM": "-LG7zzWHHQwKBtolZ0BV",
		"Forest Grove FM": "-LG7zzWRxQsKNEjrFfhN",
		Forest_Grove_FM: "-LG7zzWRxQsKNEjrFfhN",
		Hillsbor_Kaiser: "-LG7zzWVAz1rBVoE14IW",
		Hillsboro_Saturday: "-LG7zzW9w-WeY98pdmHa",
		Orenco_Station: "-LG7zzWDjYiy2Cbq_Vvi",
		Hillsdale: "-LG7zzWZ458b0SZ3GV_r",
		Moreland: "-LG7zzWMHxIs9MpoIuys",
		Oregon_City: "-LG7zzW5qIhf7buTPHbq",
		Bridgeport_Village_FM: "-LG7zzWTpCtTr3upAVJP",
		Salem_Hospital: "-LG7zzVsA2C3jKO7a2Yz",
		Salem_Saturday: "-LG7zzWCl9HCq-vEWKAO",
		Salem_Wednesday: "-LG7zzWK0ZHhYINDnUJY",
		South_Waterfront: "-LG7zzWSYmNwcD0GC4YS",
		St_Johns_FM: "-LG7zzWAuwq7EM6B5-Hm",
		Happy_Valley: "-LG7zzWYzdFWYx-xNy71",
		Hawthorne: "-LG7zzWIARLFo9__SwdR",
		Tigard_FM: "-LG7zzW_hOJLIpxDvPt0",
		West_Linn: "-LG7zzWXPZYxLJM8nPWd",
		Dallas_Bounty: "-LG7zzWEDqPW6tIZxMHe",
		McMinnville: "-LG7zzWGz-Y9rrbspcUO"
	};

	//download all sales days
	firebase.read('sales_days').then(function success(s) {

		//iterate through
		Object.keys(s).forEach(function (key) {

			var customerName = s[key].customer_name;

			var writePath = 'customers/' + customerKey[customerName] + '/sales_days'
			firebase.push(writePath, key).then(function success(s) {
				console.log(writePath, 'written successfully');
			}).catch(function error(e) {
				console.log('error writing', writePath, e);
			});

			//if(returnObject[customerName] == undefined) returnObject[customerName] = [];

			//returnObject[customerName].push(key);

		});

		//console.log(returnObject);

	}).catch(function error(e) {
		console.log('error', e);
	});
}

//	TEST
function test() { console.log('good CME Test'); }

//return the module
module.exports = cme_maintenance;


