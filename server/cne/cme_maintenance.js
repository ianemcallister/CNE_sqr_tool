/*
*	AHNUTS CME FUNCTIONS
*
*	This is the Ah-nuts calendar functions method
*/

//define dependencies
var firebase		= require('../firebase/firebase.js');
var stdio			= require('../stdio/stdio_api.js');
var sqrtxs 			= require('../square/ahnuts_sqr_tx_sync.js');
var squareV1		= require('../square/v1_api.js');

//define module
var cme_maintenance = {
	_private: {
		batch_update_txs: _private_batch_update_txs,
		batch_locations_dates_download: _private_batch_locations_dates_download
	},
	calculate: {
		salesday_summary: calculate_salesday_summary,
		salesday_commissions: calculate_salesday_commissions
	},
	check: {
		known_cme: check_known_cme
	},
	sync: {
		sales_days_to_customers: sync_sales_days_to_customers,
		an_txs_to_sqrt: sync_an_txs_to_sqrt
	},
	update: {
		tx: {
			update_simple_salesdays_remote_db: update_simple_salesdays_remote_db,
			update_salesdays_net_gross_sales: update_salesdays_net_gross_sales,
			update_commissions: update_commissions
		}
	},
	test: test
};

function batch_requests(locationId, startTime, endTime) {
	//define local variables
	
	//return async work
	return new Promise(function(resolve, reject) {
		
		console.log(locationId, startTime, endTime);

		//get payments list
		squareV1.payments.list(locationId, startTime, endTime).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});

	});

};

//
function _private_batch_update_txs(allLocations, startDate) {
	//define local variables
	var endDate = '2018-07-03T00:00:00Z'; //new Date('');
	var allPromises = [];

	//return async work
	return new Promise(function(resolve, reject) {

		//iterate through each of the locations
		allLocations.forEach(function(locationId) {

			allPromises.push(batch_requests(locationId, startDate, endDate));
			//console.log(locationId);
		});

		//when all the promises resolve move on
		Promise.all(allPromises).then(function succcess(s) {
			resolve([s, endDate]);
		}).catch(function error(e) {
			reject(e);
		});

	});

};

//
function _private_locations_list_download() {
	//define local variables

	//notify location
	//console.log('got to _private_locations_list_download');

	//return async work
	return new Promise(function(resolve, reject) {
		resolve(['M53KQT35YKE5C', '14E8S7P16JQDM']);
	});

};

//
function _private_batch_last_updated_value() {
	//define local variables

	//notify location
	//console.log('got to _private_batch_last_updated_value');

	//return async work
	return new Promise(function(resolve, reject) {
		resolve({ timestamp: "2018-07-01T00:00:00Z", successful: true });
	});

};

//	
/*
*	This funciton updates the log to reflect the successful 
*/
function _private_update_lastUpdated_log(startId, currentTimestamp) {
	//define local variables

	//notify location
	//console.log('got to _private_update_lastUpdated_log');

	//return async work
	return new Promise(function(resolve, reject) {
		resolve();
	});

};

//
function _private_batch_locations_dates_download() {
	//define local variables

	//notify location
	//console.log('got to _private_batch_locations_dates_download');

	//return async work
	return new Promise(function(resolve, reject) {

		//download locations list from square
		var locationsPromise = _private_locations_list_download();
		//download last successfuly batch update from firebase
		var lastUpdatePromise = _private_batch_last_updated_value();

		//resolve promises
		Promise.all([locationsPromise, lastUpdatePromise]).then(function success(s) {
			
			//define local variable
			var locationsList = s[0];
			var lastUpdated = s[1];

			//run through locations list
			_private_batch_update_txs(locationsList, lastUpdated.timestamp).then(function success(ss) {
				
				//if all updates were successful, write success to the lastUpdated log
				_private_update_lastUpdated_log(lastUpdated.$id, ss).then(function success(sss) {

					resolve(ss, sss);

				}).catch(function error(eee) {
					reject(eee);
				});

			}).catch(function error(ee) {
				reject(ee);
			});

		}).catch(function error(e) {
			reject(e);
		});

	});

};


//everytime a transaction comes in it should be sorted
//	INTERNAL ONLY: Download Detailed TX Array
function _download_detailed_tx_array(txListPath) {
	//define local variables
	var txList = [];
	var promisesArray = [];
	var detailedTxList = [];

	//return async work
	return new Promise(function(resolve, reject) {

		//download all transactions
		firebase.read(txListPath).then(function success(txIdObject) {
			
			//iterate through each tx in the list
			Object.keys(txIdObject).forEach(function keyfinder(key) {
				
				txList.push(txIdObject[key]);

			});

			console.log('lenght', txList.length);

			//iterate through tx
			txList.forEach(function keyfinder(key) {
				var txPath = 'transactions/' + key;

				promisesArray.push(firebase.read(txPath));

			});

			//run all promises
			Promise.all(promisesArray).then(function success(detailedTxList) {

				//return the result
				resolve(detailedTxList);

			}).catch(function error(e) {
				reject(e);
			});

		}).catch(function error(e) {
			reject(e);
		});

	});
};

//	INTERNAL ONLY: Sum Gross Sales
function _sum_tx_field(field, detailedTxList) {
	//define local variables
	var sum = 0;

	//iterate through all tx
	detailedTxList.forEach(function txFinder(tx) {

		//as long as it's nut a null value, save it
		if(tx != null) {

			sum += tx[field];

		}
		
	});

	return sum;

};

function _sum_tender_values(detailedTxList) {
	//define local variables
	var returnObject = {
		cash: 0,
		credit: 0,
		other: 0,
		tokens: 0
	};
	var pymnt_hash = { "CREDIT_CARD": "credit", "CASH": "cash" }

	//iterate through all tx
	detailedTxList.forEach(function txFinder(tx) {

		//as long as it's nut a null value, save it
		if(tx != null) {
			
			//iterate through Till
			Object.keys(tx.tender).forEach(function keyfinder(key) {
				returnObject[pymnt_hash[tx.tender[key].type]] += tx.tender[key].total_money	
			});

		}
		
	});

	return returnObject;	
};

//	UPDATE DALESDAYS REMOTE DB
function update_simple_salesdays_remote_db(txField, salesdayField, salesday_id, detailedTxList) {
	//return async work
	return new Promise(function(resolve, reject) {
		//define local variables
		var dbPath = 'sales_days/' + salesday_id + '/financial_summary';

		var newValue = _sum_tx_field(txField, detailedTxList);
		var newObject = {};
		newObject[salesdayField] = newValue;

		//write the value to the DB
		firebase.update(dbPath, newObject).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {	
			reject(e);
		});
	});	
};

//	UPDATE SALESDAYS PAYMENT MTHDS
function update_salesdays_payment_mthds(salesday_id, detailedTxList) {
	//return async work
	return new Promise(function(resolve, reject) {
		//define local variables
		var dbPath = 'sales_days/' + salesday_id + '/financial_summary/pay_method_breakdown';

		var newObject = _sum_tender_values(detailedTxList);

		//write the value to the DB
		firebase.update(dbPath, newObject).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {	
			reject(e);
		});
	});	
};

function update_salesdays_net_gross_sales(salesday_id, detailedTxList) {
	//return async work
	return new Promise(function(resolve, reject) {
		//define local variables
		var dbPath = 'sales_days/' + salesday_id + '/financial_summary';

		var gross_sales = _sum_tx_field('gross_sales_money', detailedTxList);
		var total_refunds = _sum_tx_field('refunded_money', detailedTxList);
		var newObject = {};
		newObject['net_sales_money'] = gross_sales - total_refunds;

		//write the value to the DB
		firebase.update(dbPath, newObject).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {	
			reject(e);
		});
	});	
};

function update_commissions(salesday_id, detailedTxList) {
	//return async work
	return new Promise(function(resolve, reject) {
		//define local variables
		var dbPath = 'sales_days/' + salesday_id + '/financial_summary';

		var gross_sales = _sum_tx_field('gross_sales_money', detailedTxList);
		var total_refunds = _sum_tx_field('refunded_money', detailedTxList);
		var net_sales_money = gross_sales - total_refunds;
		var newObject = {};
		calculate_salesday_commissions(salesday_id, net_sales_money).then(function success(s) {

			newObject['commissions_total'] = s;

			//write the value to the DB
			firebase.update(dbPath, newObject).then(function success(ss) {
				resolve(ss);
			}).catch(function error(ee) {	
				reject(ee);
			});

		}).catch(function error(e) {
			reject(e);
		});

	});	
};


//	 CALCULATE_SALESDAY SUMMARY
function calculate_salesday_summary(salesday_id) {
	//define local variables
	var txListPath = "sales_days/" + salesday_id + '/transactions';
	
	//notify progress
	console.log('salesday_id', salesday_id);

	//start by downloading the transactions
	_download_detailed_tx_array(txListPath).then(function success(detailedTxList) {
		//define local variable

		//notify the progress
		//console.log(s.length, 'SUCCESS');

		//next parse the data
		var fieldUpdates = [
			update_simple_salesdays_remote_db('gross_sales_money', 'gross_sales', salesday_id, detailedTxList),
			update_simple_salesdays_remote_db('refunded_money', 'refunds', salesday_id, detailedTxList),
			//update_simple_salesdays_remote_db('net_sales_money', 'net_gross_sales', salesday_id, detailedTxList),
			update_simple_salesdays_remote_db('discount_money', 'discounts', salesday_id, detailedTxList),
			update_simple_salesdays_remote_db('tip_money', 'tips', salesday_id, detailedTxList),
			update_simple_salesdays_remote_db('processing_fee_money', 'processing_fees', salesday_id, detailedTxList),
			update_salesdays_payment_mthds(salesday_id, detailedTxList),
			update_salesdays_net_gross_sales(salesday_id, detailedTxList),
			update_commissions(salesday_id, detailedTxList)
			//_sum_net_gross_sales(detailedTxList),
		];

		//run all the promises
		Promise.all(fieldUpdates).then(function success(s) {
			//once all the updates have been made notify the user
			console.log('All', s.length, 'updates made successuflly', s);
		}).catch(function error(e) {	
			console.log("Error", e);
		});

	}).catch(function error(e) {	
		console.log("Error", e);
	});

};

// 	CALCULATE SALESDAY COMMISSIONS
function calculate_salesday_commissions(salesday_id, net_sales_money) {
	//define local variables
	var readpath = 'sales_days/' + salesday_id + "/hrs/sales_total";

	//return async work
	return new Promise(function(resolve, reject) {
		//collect the reference from the db
		firebase.read(readpath).then(function success(salesHours) {

			var sales_per_hour = (net_sales_money / salesHours) / 100;
			var commission_multiplier = sales_per_hour / 2752;
			var commission_rate = sales_per_hour * commission_multiplier;
			var commission = (salesHours * commission_rate) * 100;

			console.log('sales_per_hour', sales_per_hour);
			console.log('commission_multiplier', commission_multiplier);
			console.log('commission_rate', commission_rate);
			console.log('commission', commission);

			resolve(commission);

		}).catch(function error(e) {
			reject('an error occured', e);
		});

	});

};

//	CHECK KNOWN CME
function check_known_cme(ahnuts_tx) {
	//define local variables
	var known_cme_object = {
		is_known: false,
		customer: "",
		salesDay: ""
	};
	var tx_key = ""

	//pull the key
	Object.keys(ahnuts_tx).forEach(function(key) {
		tx_key = key;
	})

	var tx_date = ((ahnuts_tx[tx_key].created_at).split('T'))[0];
	var emp_id = ahnuts_tx[tx_key].employee_id;
	
	//define the read path
	var readpath = 'reference_lists/CME_by_employee_and_date/' + tx_date + "/" + emp_id;

	//notify user
	console.log("check_known_cme readpath", readpath);

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

//	SYNC SALES TRANSACTIONS BETWEEN SQUARE AND AH-NUTS
/*
*	Syncs both batch and single transcations from square to the ah-nuts database. 
*/
function sync_an_txs_to_sqrt(type, pushObject) {
	//define local variables
	var typeHash = {"batch": 0, "single": 1};

	//notify location
	//console.log('got to sync_an_txs_to_sqrt');

	//return async work
	return new Promise(function(resolve, reject) {

		//switch based on type
		switch(typeHash[type]) {
			case 0:
				_private_batch_locations_dates_download().then(function success(s) {
					resolve(s);
				}).catch(function error(e) {
					reject(e);
				});
				break;
			case 1:
				sqrtxs.push_requests(pushObject).then(function success(s) {
					resolve(s);
				}).catch(function error(e) {
					reject(e);
				});
				break;
			default:
				break;
		};

	});

};

//	TEST
function test() { console.log('good CME Test'); }

//return the module
module.exports = cme_maintenance;


