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
		},
		sales_day: {
			batch: "",
			single: download_single_sales_day
		}
	},
	read: {
		txs: {
			single: read_single_tx
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
		},
		tx_block: {
			single: update_tx_block_single_tx
		}
	},
	test: test
};

/*
*	UPDATE TRANSACTION BLOCK WITH SINGLE TX
*
*
*/
function update_tx_block_single_tx(location_id, allPromises) {
	//define local variables
	var tx = allPromises[0];
	var employeesList = allPromises[1];
	var locationsList = allPromises[2];
	var blockPath = data.format.block_txs.id(tx, location_id);
	
	//return async work
	return new Promise(function(resolve, reject) {

		//	1. CHECK FOR A CURRENT ITERATION OF THE OBJECT
		firebase.read(blockPath)
		.then(function success(currentBlock) {
			 	
			//	2. CHECK IF THE OBJECT CURRENTLY EXISTS
			if(currentBlock == undefined) {
				//	2.1 IF NO OBJECT EXISTS, CREATE IT
				var newBlock = data.format.block_txs.object(tx, location_id, employeesList, locationsList)

				//	2.1.1 THEN SAVE IT
				firebase.push(blockPath, newBlock)
				.then(function success(ss) {
					resolve(ss);
				}).catch(function error(ee) {
					reject(ee);
				});

			} else {
				//	2.2 IF THE OBJECT DOES EXIST, ADD THE TX TO THE PROPER SPLIT

				//iterate through all the splits
				Object.keys(currentBlock).forEach(function(key) {

					//check the window
					if(data.calculate.tx.within_window(tx.created_at, currentBlock[key].window, location_id)) {
						// if it's good
						var updatePath = blockPath + "/" + key + "/txs";
						var updateObject = data.format.block_txs.single_tx(tx.created_at, tx.id, location_id)
						//notify progress
						console.log('fits the window');

						firebase.update(updatePath, updateObject)

					} else {
						// if it's not good

						//notify progress
						console.log('not in the window');
					}

				});

				resolve('exiting');

			}

		}).catch(function error(e) {
			reject(e);
		});

	});

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
function batch_download_txs(batchLog, employeesList, locationsList) { 
	
	//define local variables
	var batchStrt = Object.keys(batchLog)[0];
	var batchEnds = data.general.current_time();

	//TODO: DEAL WITH THE NUMBER OF REQUESTS LATER FOR NOW JUST GET TX FOR PRIMARY LOCATIONS
	locationsList = [
		{"id": "M53KQT35YKE5C", "name": "Oregon"},
		{"id": "14E8S7P16JQDM", "name": "Utah"}
	];
		
	//TODO: IF THE LAST DOWNLOAD WAS NOT SUCCESSFUL, GO FURTHER BACK

	//return async work
	return new Promise(function(resolve, reject) {
		//define local variables
		var allLocationPromises = [];
		var counter = 0;

		//	1. ITERATE THROUGH ALL THE LOCATIONS
		Object.keys(locationsList).forEach(function(locKey) {
			//define local variables
			var locationId = locationsList[locKey].id;
			var locationSalesPromise = squareV1.payments.list(locationId, batchStrt, batchEnds);

			//	2. EACH SQUARE LOCATION GETS ITS OWN PROMISE, ADD TO THE ARRAY
			allLocationPromises.push(locationSalesPromise);
		});	

		//	3. ALLOW ALL PROMISES TO RESOLVE
		Promise.all(allLocationPromises)
		.then(function success(allLocationsTxs) {
			
			//	4. UPDATE ALL RECORDS WITH NEW TRANSACTIONS
			batch_update_txs(allLocationsTxs, batchStrt, batchEnds, locationsList, employeesList)
			.then(function success(s) {
				resolve(s);
			}).catch(function error(ee) {
				reject(e);
			});

		}).catch(function error(e) {
			reject(e);
		});

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
*	DOWNLOAD SINGLE TRANSACTION
*
*	This is used to..
*/
function download_single_sales_day(sales_day_id) { 
	//define local variables
	var readPath = "sales_days/" + sales_day_id;

	//notify progress
	//console.log('tx_id', tx_id, 'location_id', location_id);
	
	//return Async Work
	return new Promise(function(resolve, reject) {
		
		//download tx from square
		firebase.read(readPath).then(function success(sales_day) {
			resolve(sales_day);
		}).catch(function error(e) {
			reject('error', e);
		});

	}); 

};

/*
*	READ SINGLE TRANSACTION
*
*	This is used to read a single transaction from the ah-nuts database
*/
function read_single_tx(tx_id) { 
	//define local variables
	var readPath = "transactions/" + tx_id;
	
	//return Async Work
	return new Promise(function(resolve, reject) {
		
		//download tx from square
		firebase.read(readPath).then(function success(tx) {
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
	
	//TODO: ADD DEVICE NAMES IF NOT ALREADY ADDED
	//TODO: ADD TEAM MEMBERS IF NOT ALREADY ADDED

	//return async work
	return new Promise(function(resolve, reject) {
		
		//LATER THIS CAN DISCERN BETWEEN DIFFERENT TX TYPES 
		//iterate through fieldsArray
		fieldsArray.forEach(function(field) {

			//read the current transactions present
			firebase.read(readPath).then(function success(allSalesdayTx) {
				var writePath = 'sales_days/' + sales_day_id + "/transactions";
				var flaggedTx = false;

				//console.log('got these salesday tx', allSalesdayTx);

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
function update_sales_calculations(sales_day_id, location_id) { 
	//define local variables
	var txPromises = [];

	//return async work
	return new Promise(function(resolve, reject) {
		
		//1. Downlaod the sales_day object
		download_single_sales_day(sales_day_id).then(function success(salesDayObject) {

			//2. Download all the tx in the sales day
			//Start by iterating through all transactions
			Object.keys(salesDayObject.transactions).forEach(function(key) {
				//define local variables
				
				//only select actual transactions
				if(salesDayObject.transactions[key] != "placeholder") {

					//add the transactions to the array
					txPromises.push(read_single_tx(salesDayObject.transactions[key]));
				}
				
			});

			//Wait for all promises to resolve
			//3. run all calculations
			Promise.all(txPromises).then(function success(allTx) {
				//define local variables
				var updateObject = {
					"financial_summary/discounts": data.calculate.financial.sums(allTx, "discounts"),
					"financial_summary/gross_sales": data.calculate.financial.sums(allTx, "gross_sales"),
					"financial_summary/net_gross_sales": data.calculate.financial.sums(allTx, "net_gross_sales"),
					"financial_summary/no_of_tx": data.calculate.financial.sums(allTx, "no_of_tx"),
					"financial_summary/refunds": data.calculate.financial.sums(allTx, "refunds"),
					"financial_summary/tips": data.calculate.financial.sums(allTx, "tips"),
					"financial_summary/pay_method_breakdown": data.calculate.financial.tx_types(allTx),
					mfg_summary: {
						//TODO: ADD MFG CALCULATIONS LATER
						0: "placeholder"
					},
					product_sales_summary: {
						//TODO: ADD PRODUCT SALES CALCULATIONS LATER
						0: "placeholder"
					},
					raw_resources: {
						//TODO: ADD RAW RESOURCES CALCULATIONS LATER
						0: "placeholder"
					}
				};
				var writePath = "sales_days/" + sales_day_id;

				//4. Update the sales_day in the db
				firebase.update(writePath, updateObject).then(function success(sss) {
					resolve(sss);
				}).catch(function error(eee) {
					reject(eee);
				});

			}).catch(function error(ee) {
				reject(ee);
			});

		}).catch(function error(e) {
			reject(e);
		});


		//resolve('update_sales_calculations');
	}); 

};

/*
*	BATCH UPDATE TRANSACTINS
*
*	This is used to..
*/
function batch_update_txs(allLocationTxs, batchStrt, batchEnds, locationsList, employeesList) { 
	//define local variables
	var strtDate = data.parse.date_yyyy_mm_dd(batchStrt);
	var endsDate = data.parse.date_yyyy_mm_dd(batchEnds);
	var txBlocksPromsise = firebase.read_specific.range('tx_blocks', strtDate, endsDate);

	//return async work
	return new Promise(function(resolve, reject) {
		
		//	1. DOWNLOAD CURRENT BLOCKS FOR THIS DATE RANGE
		txBlocksPromsise.then(function success(allBlocks) {
			//define local variables
			var counter = 0;
			var updatesToProcess = {};

			if(allBlocks == undefined || allBlocks == null) allBlocks = {};

			//notify progress
			console.log('allLocationTxs', allLocationTxs.length);

			//	1. ITERATE OVER ALL LOCATIONS
			allLocationTxs.forEach(function(location) {

				//notify progress
				//console.log('location Txs', location.length);

				//	2. ITERATE OVER ALL TXS
				location.forEach(function(tx) {

					//notify progress
					//console.log(tx);

					//define local varaibles
					var txCounter = 0;
					var txDate = "UNKNOWN";
					var txEmployee = "UNKNOWN";
					var txDevice = 'UNKNOWN';

					//console.log('tx', txCounter);

					if(data.parse.date_yyyy_mm_dd(tx.created_at) != undefined) txDate = data.parse.date_yyyy_mm_dd(tx.created_at);
					if(tx.tender[0].employee_id != undefined) txEmployee = tx.tender[0].employee_id;
					if(tx.device != undefined) txDevice = data.parse.tx_device_id(tx.device.id);

					//update last variable
					var updatePath = txDate + "/" + txEmployee + "/" + txDevice;

					//notify progress
					console.log('txDate', txDate, 'txEmployee', txEmployee, 'txDevice', txDevice);

					//	3. DOES THE TX BLOCK ALREADY EXIST
					if(!data.test.tx_block_exists(allBlocks, txDate, txEmployee, txDevice)) {
						//notify progress
						console.log('creating new exists', allBlocks);

						//	3.1 IF IT DOESN'T EXIST CREATE A NEW ONE
						var newBlock = data.format.block_txs.object(tx, locationsList[counter].id, employeesList, locationsList, txEmployee);
						
						//	3.1.1 ADD THE NEW VALUES TO THE BLOCK FOR SUBSEQUENT TRANSACTIONS
						allBlocks = data.format.block_txs.batch_block(allBlocks, txDate, txEmployee, txDevice, newBlock);

						//	3.1.2 TURN THE NEW BLOCK INTO A BATCH OF UPDATES TO BE PROCESSED
						updatePath = updatePath + "/" + txDate + txEmployee + txDevice;
						var batchUpdates = data.parse.block_to_batch_updates(updatePath, newBlock);

						//	3.1.1 ADD ALL UPDATES TO THE MASTER UPDATES
						batchUpdates.forEach(function(update) {
							
							var updateKey = Object.keys(update)[0];
							updatesToProcess[updateKey] = update[updateKey];
							
						});

					} else {
						
						//	3.2 IF THE BLOCK ALREADY EXISTS, ADD THE TX TO THE PROPER SPLIT
						//iterate over the split keys
						Object.keys(allBlocks[txDate][txEmployee][txDevice]).forEach(function(splitKey) {
							//define local variables
							var updateTime = data.parse.sqr_tx_time(tx.created_at, tx.id, location.id)
							updatePath = updatePath + "/" + splitKey + "/txs/" + updateTime;
							
							//
							updatesToProcess[updatePath] = tx.id;
						});

					}


					//incriment tx counter
					txCounter++;
				});

				//notify or progress
				console.log("location", counter, "txs", location.length);

				//incriment the counter
				counter++;;
			});

			data.write.json('./testResults/updatesTest.json', updatesToProcess);

			//once all the updates have been established, process them in the database
			firebase.update('tx_blocks', updatesToProcess)
			.then(function success(s) {
				resolve(s);
			}).catch(function error(ee) {
				reject(ee);
			});
			//resolve(updatesToProcess);

		}).catch(function error(e) {
			reject(e);
		});

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


