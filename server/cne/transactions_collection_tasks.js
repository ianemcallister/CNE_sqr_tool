/*
*	AH-NUTS / CAPITALIST NUT ENTERPRISES:
*	MAINTENANCE: TRANSACTIONS COLLECTION tasks
*
*	This module...
*/

//define dependencies
var squareV1		= require('../square/v1_api.js');
var firebase		= require('../firebase/firebase.js');
var data			= require('./transactions_collection_data_formatting.js');

//define module
var tasks = {
	check: {
		lists: {
			known_cme: check_known_cme
		}
	},
	download: {
		txs: {
			batch: batch_download_txs,
			single: download_single_tx
		}
	},
	save: {
		tx_to_db: save_tx_to_db
	},
	update: {
		lists: {
			unassigned_tx: update_unassigned_tx_list
		},
		logs: {
			last_tx: update_last_tx_log
		},
		sales_day: {
			fields: update_sales_day_field,
			calculations: update_sales_calculations
		},
		txs: {
			batch: batch_update_txs,
			single: update_single_tx,
			fields: update_tx_fields
		}
	},
	test: test
};

/*
*	CHECK KNOWN CME
*
*	This is used to..
*/
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

			resolve({status:'FOUND', ref:known_cme_object});

		}).catch(function error(e) {
			//if there was a type error then the records required don't exist in the database
			var rawError = e.toString();
			var errorSplit = rawError.split(':');
			if(errorSplit[0] == 'TypeError') resolve({status:'NOT_FOUND', ref:{}});

			reject(e);
		});

	});

};

/*
*	BATCH DOWNLOAD TRANSACTINS
*
*	This is used to..
*/
function batch_download_txs(locationsList, lastUpdated) { 
	//define local variables

	//return async work
	return new Promise(function(resolve, reject) {
		resolve(lastUpdated);
	}); 

};

/*
*	DOWNLOAD SINGLE TRANSACTION
*
*	This is used to..
*/
function download_single_tx(tx_id, location_id) { 
	//define local variables

	//notify progress
	//console.log('tx_id', tx_id, 'location_id', location_id);
	
	//return Async Work
	return new Promise(function(resolve, reject) {
		
		
		//download tx from square
		squareV1.payments.retrieve(tx_id, location_id).then(function success(tx) {
			resolve(tx);
		}).catch(function error(e) {
			reject('error', e);
		});

	}); 

};

/*
*	SAVE AH-NUTS TRANSACTION TO AH-NUTS DATABSAE
*
*	This is used to..
*/
function save_tx_to_db(tx_id, ahnutstx) {
	//define local variables	
	var writePath = 'transactions/' + tx_id;

	return new Promise(function(resolve, reject) {
		
		//write the records
		firebase.create(writePath, ahnutstx[tx_id]).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});

	});

};

/*
*	UPDATE UNASSIGNED TRANSACTION LIST
*
*	This is used to...
*/
function update_unassigned_tx_list(tx_id, location_id, tx) { 
	
	//define local variables
	var device_id = tx[tx_id].device_id
	var tx_date = (tx[tx_id].created_at.split("T"))[0];
	var writePath = "reference_lists/unassigned_txs/" + device_id + "/" + tx_date;

	//return async work
	return new Promise(function(resolve, reject) {
		//resolve(writePath + " " + tx_id);
		//write the tx to the db
		firebase.push(writePath, tx_id).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});
	}); 

};

/*
*	UPDATE LAST TRANSACTIONS LOG
*
*	This is used to...
*/
function update_last_tx_log(lastUpdated) { 
	//define local variables

	//return async work
	return new Promise(function(resolve, reject) {
		resolve('update_last_tx_log');
	}); 

};

/*
*	UPDATE SALES DAY FIELD
*
*	This is used to...
*/
function update_sales_day_field(sales_day_id, fieldsArray) { 
	//define local variables
	//start by handling tranactions only
	var readPath = 'sales_days/' + sales_day_id + "/transactions";
	
	//return async work
	return new Promise(function(resolve, reject) {
		
		//LATER THIS CAN DISCERN BETWEEN DIFFERENT TX TYPES 
		//iterate through fieldsArray
		fieldsArray.forEach(function(field) {

			//read the current transactions present
			firebase.read(readPath).then(function success(allSalesdayTx) {
				var writePath = 'sales_days/' + sales_day_id + "/transactions";
				var flaggedTx = false;

				//iterate through the responses
				Object.keys(allSalesdayTx).forEach(function(key) {
					if(allSalesdayTx[key] == field.data) flaggedTx = true;
				});

				//if the transaction couldn't be found in the current set, add it
				if(!flaggedTx) {

					firebase.push(writePath, field.data).then(function success(s) {
						resolve(s);
					}).catch(function error(ee) {
						reject(ee);
					});

				} else {
					resolve('Record Already Added');
				}

			}).catch(function error(e) {
				reject(e);
			});

		});

		//resolve('update_sales_day_field');
	}); 

};

/*
*	UPDATE SALES CALCULATIONS
*
*	This is used to...
*/
function update_sales_calculations(sales_day_id) { 
	//define local variables

	//return async work
	return new Promise(function(resolve, reject) {
		resolve('update_sales_calculations');
	}); 

};

/*
*	BATCH UPDATE TRANSACTINS
*
*	This is used to..
*/
function batch_update_txs(locationsList, lastUpdated) { 
	//define local variables

	//return async work
	return new Promise(function(resolve, reject) {
		resolve(lastUpdated);
	}); 

};



/*
*	UPDATE SINGLE TRANSACTION
*
*	This is used to..
*/
function update_single_tx(entity_id, location_id) { 
	//define local variables
	
	//return async work
	return new Promise(function(resolve, reject) {
		resolve(lastUpdated);
	}); 

};

/*
*	UPDATE TX FIELDS
*
*	This is used to...
*/
function update_tx_fields(tx_id, fieldsArray) { 
	//define local variables
	var writePath = "transactions/" + tx_id + "/salesDay/";

	//return async work
	return new Promise(function(resolve, reject) {

		//LATER THIS CAN DISCERN BETWEEN DIFFERENT TX TYPES 
		//iterate through fieldsArray
		fieldsArray.forEach(function(field) {

			firebase.create(writePath, field.data).then(function success(s) {
				resolve(s);
			}).catch(function error(e) {
				reject(e);
			});

		});			

		//resolve('update_tx_fields');
	}); 

};

/*
*	TEST
*
*	This is used to test the module
*/
function test() { console.log('testing transaction tasks module'); }

//return the module
module.exports = tasks;


