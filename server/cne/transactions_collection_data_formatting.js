/*
*	AH-NUTS / CAPITALIST NUT ENTERPRISES:
*	MAINTENANCE: TRANSACTIONS COLLECTION DATA FORMATTING
*
*	This module...
*/

//define dependencies
var stdio 			= require('../stdio/stdio_api.js');
var moment 			= require('moment-timezone');

//define module
var data_formatting = {
	general: {
		timezone_offset: timezone_offset,
		current_time: current_time
	},
	calculate: {
		financial: {
			sums: calculate_financial_sums,
			tx_types: calculate_tx_types
		},
		mfg: {
			sums: calculate_mfg_sums
		},
		tx: {
			within_window: calculate_tx_within_window
		}
	},
	map: {
		sq_tx_to_ahNuts_tx: map_sq_tx_to_ahNuts_tx,
		sq_tx_itmz_to_ahNuts: map_sqr_tx_itemizations_to_ahnts_tx_itemizations,
		sq_tx_tender_to_ahNuts: map_sqr_tx_tender_to_ahnts_tx_tender,
		sq_tx_mods_to_ahNuts: map_sqr_tx_mods_to_ahnts_tx_mods
	},
	parse: {
		sqr_tx_time: parse_sq_tx_time,
		date_yyyy_mm_dd: parse_date_yyyy_mm_dd,
		last_batch_sync: format_sync_log,
		tx_timestamp: parse_timestamp,
		tx_device_id: parse_tx_device_id,
		sq_txs_to_by_device_list: parse_sq_txs_to_by_device_list,
		block_to_batch_updates: parse_block_to_batch_updates
	},
	format: {
		block_txs: {
			id: format_block_txs_id,
			object: format_block_txs_object,
			fill_new_object: fill_new_block_txs_object,
			single_tx_time: format_block_tx_single_tx,
			batch_block: format_block_txs_batch_block
		}
	},
	write: {
		json: write_json
	},
	test: {
		tx_block_exists: test_tx_block_exists,
		test: test
	}
};

function write_json(path, data) {
	stdio.write.json(data, path);
}

function parse_sq_tx_time(sqTxTime, txId, location_id) {
	var timezoneOffset = timezone_offset(location_id);
	var txMoment = moment(sqTxTime).utcOffset(timezoneOffset);
	var txTime = txMoment.utcOffset(timezoneOffset).format();
	return txTime;
}

/*
*
*
*/
function parse_block_to_batch_updates(path, block) {
	//define local variables
	var returnArray = [];

	console.log('parse_block_to_batch_updates');

	//iterate through all the keys of the object
	Object.keys(block).forEach(function(key) {
		//define local variables
		var writePath = path + "/" + key;

		//look for embeded objects
		if(key == 'txs' || key == 'validation') {

			//if this is the txs, iterate through all the records
			Object.keys(block[key]).forEach(function(subKey) {
				var updateObject = {};
				writePath = writePath + "/" + subKey;

				updateObject[writePath] = block[key][subKey];

				returnArray.push(updateObject);
			});

		} else {
			var updateObject = {};
			updateObject[writePath] = block[key];

			returnArray.push(updateObject);
		}

	});

	//console.log('returnArray', returnArray);

	//return array
	return returnArray;
}

/*
*
*
*/
function format_block_txs_batch_block(allBlocks, txDate, txEmployee, txDevice, newBlock) {
	//define local variables
	var returnObject = allBlocks;
	var splitKey = txDate + txEmployee + txDevice

	console.log('starting with', allBlocks, txDate, txEmployee, txDevice, newBlock);

	//add the available data
	if(returnObject[txDate] == undefined) returnObject[txDate] = {};
	if(returnObject[txDate][txEmployee] == undefined) returnObject[txDate][txEmployee] = {};
	if(returnObject[txDate][txEmployee][txDevice] == undefined) returnObject[txDate][txEmployee][txDevice] = {};

	//then add the split key
	returnObject[txDate][txEmployee][txDevice][splitKey] = newBlock;

	//console.log('returning this', returnObject);

	return returnObject;
}


function test_tx_block_exists(allBlocks, txDate, txEmployee, txDevice) {
	//define local variables
	var blockExists = true;

	//console.log('test_tx_block_exists', allBlocks, txDate, txEmployee, txDevice);

	//test for date
	if(allBlocks[txDate] == undefined) blockExists = false;
	else {
		//then for employee
		if(allBlocks[txDate][txEmployee] == undefined) blockExists = false;
		else {
			//then for device
			if(allBlocks[txDate][txEmployee][txDevice] == undefined) blockExists = false;
		};
		
	};

	return blockExists
}

function parse_date_yyyy_mm_dd(date) {
	return moment(date).format("YYYY-MM-DD");
}

function current_time() {
	var currentTime = moment(new Date());
	return currentTime.format();
}

function format_block_tx_single_tx(sqTxTime, txId, location_id) {
	var timezoneOffset = timezone_offset(location_id);
	var txMoment = moment(sqTxTime).utcOffset(timezoneOffset);
	var txTime = txMoment.utcOffset(timezoneOffset).format();
	var returnObject = {};
	returnObject[txTime] = txId;
	return returnObject;
}

function calculate_tx_within_window(txTime, window, location_id) {
	//define local variables
	var timezoneOffset = timezone_offset(location_id);
	var txMoment = moment(txTime).utcOffset(timezoneOffset);
	var windowStart = window.split("/")[0];
	var windowFinish = window.split("/")[1];

	return txMoment.isBetween(windowStart, windowFinish);
}

/*
*	FILL NEW BLOCK TRANSACTIONS OBJECT
*/
function fill_new_block_txs_object(sqrTx, location_id, employeesList, locationsList, txEmployee) {
	//define local variables
	//console.log('formatting block object');

	var timezoneOffset = timezone_offset(location_id);
	var returnObject = stdio.read.json('./models/txs_block.json');
	var employeeId = "UNKNOWN";
	var deviceId = "UNKNOWN";
	var deviceName = "UNKNOWN";
	var employeeName = "";
	var locationName = "";

	console.log('sqrTx.device', sqrTx.device, 'sqrTx.tender', sqrTx.tender);

	//error checking
	if(sqrTx.tender[0].employee_id != undefined) employeeId = sqrTx.tender[0].employee_id;
	if(employeeId == undefined) employeeId = txEmployee;
	if(sqrTx.device.id != undefined) {
		deviceId = sqrTx.device.id;
		deviceName = sqrTx.device.name;
	};

	//	1. SETUP DATE VARIABLES
	var dateObject = new Date(sqrTx.created_at);
	var fullDate = moment(dateObject).format();
	var splitDate = fullDate.split("T");
	var date = splitDate[0];

	//	2. ACCOUNT FOR TIMEZONE OFFSET
	var txMoment = moment(sqrTx.created_at).utcOffset(timezoneOffset);
	var txTime = txMoment.utcOffset(timezoneOffset).format();

	//	3. SET EMPLOYEE NAME
	employeesList.forEach(function(employee) {
		if(employee.id == employeeId) employeeName = employee.first_name + " " + employee.last_name;
	});

	//	4. SET LOCATION NAME
	locationsList.forEach(function(location) {
		if(location.id == location_id) locationName = location.name;
	});

	//update values
	returnObject.date = date;
	returnObject.device_id = deviceId;
	returnObject.device_name = deviceName;
	returnObject.employee_id = employeeId;
	returnObject.employee_name = employeeName;
	returnObject.location_id = location_id;
	returnObject.location_name = locationName;
	returnObject.txs[txTime] = sqrTx.id
	returnObject.window = date + "T00:00:00" + timezoneOffset + "/" + date + "T23:59:59" + timezoneOffset;

	//console.log('returning this object', returnObject);
	//return the returnObject
	return returnObject;
};

function timezone_offset(location_id) {
	//define local variables
	var returnString = "";

	var locationsHash = { "M53KQT35YKE5C": "-07:00", "14E8S7P16JQDM": "-06:00" }

	if(locationsHash[location_id] != undefined)
		returnString = locationsHash[location_id];

	//return string
	return returnString;
}

// FORMAT BLOCK TRANSACTION OBJECT
function format_block_txs_object(sqrTx, location_id, employeesList, locationsList) {
	//define local value
	return fill_new_block_txs_object(sqrTx, location_id, employeesList, locationsList);
};

// FORMAT BLOCK TRANSACTIONS
function format_block_txs_id(sqrTx, location_id) {
	//define local variables
	var blockPath = "tx_blocks/";
	var timezoneOffset = timezone_offset(location_id);

	//define the date
	var dateObject = new Date(sqrTx.created_at);
	var fullDate = moment(dateObject).utcOffset(timezoneOffset).format();
	var splitDate = fullDate.split("T");
	var date = splitDate[0];

	//defne the employee id
	var employee_id = sqrTx.tender[0].employee_id;

	//define the device
	var device_id = parse_tx_device_id(sqrTx.device.id);

	//define the block_id
	blockPath = blockPath + date + "/" + employee_id + "/" + device_id;

	//return value
	return blockPath;
}

function parse_sq_txs_to_by_device_list(txArray) {
	//define local variables
	var deviceArray = [];
	var deviceObject = {};
	var txsObject = {};

	//console.log(hrBlocks);

	//iterate through list of transactions
	txArray.forEach(function(tx) {
		//define the local variables
		var deviceId = parse_tx_device_id(tx.device.id);
		var employeeId = tx.tender[0].employee_id;
		var arrayId = deviceId + "_" + employeeId;
		var deviceName = tx.device.name;
		var txHr = moment(tx.created_at).hour();
		var tx_id = tx.id;

		//console.log(txHr);

		//add the tx to the txObject
		txsObject[tx.id] = tx;

		//add device Id's 
		if(deviceObject[arrayId]==undefined) deviceObject[arrayId] = {
			device_id: deviceId,
			device_name: deviceName,
			employee: employeeId,
			hrs: stdio.read.json('./templates/hrblocks.json'),
			sales_total: 0,
			no_txs: 0,
			txs: []
		};

		//add the tx_id
		deviceObject[arrayId].txs.push(tx_id);

		//add to the device sales
		deviceObject[arrayId].sales_total += (tx.gross_sales_money.amount - tx.discount_money.amount);

		//incriment the number of transactions
		deviceObject[arrayId].no_txs++;

		//add to the hour number
		deviceObject[arrayId].hrs[txHr].sum += (tx.gross_sales_money.amount - tx.discount_money.amount);

		//add to the hour number of transactions
		deviceObject[arrayId].hrs[txHr].no_of++;

	});

	//console.log(deviceObject);

	return deviceObject;
}

/*
*	CALCULATE FINANCIAL SUMS
*
*	This function accepts an array of transactions and field that needs to be summed
*/
function calculate_financial_sums(allTx, field) {
	//define local variables
	var localSum = 0;
	var fieldKey = {"discounts": "discount_money", "gross_sales":"gross_sales_money", "net_gross_sales":"net_sales_money", "no_of_tx":"", "refunds":"refunded_money", "tips": "tip_money" };
	
	//notify progress
	//console.log("allTx.length", allTx.length)

	//iterate through transactions
	allTx.forEach(function(tx) {

		//select time of sum
		if(field=="no_of_tx") {
			localSum++;
		} else if(tx != null) {
			localSum += parseInt(tx[fieldKey[field]])
		}

	});


	return localSum;
};

/*
*	CALCULATE TRANSACTION TYPES
*
*	This function accepts an array of transactions and and returns and object
*/
function calculate_tx_types(allTx) {
	//define local variables
	var returnObject = {
		cash: 0,
		credit: 0,
		other: 0,
		tokens: 0
	};
	var typeKey = {"CASH": "cash", "CREDIT_CARD":"credit", "OTHER": "other", "NO_SALE":"cash" };

	//iterate through transactions
	allTx.forEach(function(tx) {

		if(tx != null) {	

			//then iterate trough the tender
			Object.keys(tx.tender).forEach(function(key) {
				//console.log("tx.tender[key].type", tx.tender[key].type);

				returnObject[typeKey[tx.tender[key].type]] += parseInt(tx.tender[key].total_money);
			});

		}

	});

	//return object
	return returnObject
};

/*
*	CALCULATE MANUFACTURING SUMS
*
*	This function accepts an array of transactions and field that needs to be summed
*/
function calculate_mfg_sums(allTx, field) {
	//define local variables
	var localSum = 1;



	return localSum;
};

/*
*	FORMAT SYNC LOG
*
*	This function formats the log object returned from fire base.  It returns a string
*
*	@param - logObjectPromise { (key):{ timestamp: "1980-01-01T00:00:00Z", successful: true } }
* 	@return - returnDate [string] i.e. "1980-01-01T00:00:00Z"
*/
function format_sync_log(logObjectPromise) {
	//define local variables
	var returnDate = new Date('1980-01-01T00:00:00Z');
	
	//return async work
	return new Promise(function(resolve, reject) {

		//wait for promise to resolve
		logObjectPromise.then(function success(s) {

			//iterate through the list, find the most recent one, keep it
			Object.keys(s).forEach(function(key) {

				var newDate = new Date(s[key].timestamp);

				if(newDate > returnDate) returnDate = newDate
				
			});

			//return the newest date
			resolve(returnDate);

		});

	});

};

/*
*	MAP SQUARE TRANSACTION TO AH-NUTS TRANSACTION
*
*	This function maps a square transaction to an ah-nuts transaction
*
*	@param - logObjectPromise { (key):{ timestamp: "1980-01-01T00:00:00Z", successful: true } }
*	@param - location_id [string] i.e.
* 	@return - ahnuts_tx {}
*/
function map_sq_tx_to_ahNuts_tx(sqrTx, location_id) {
	//define local variables
	var ahnuts_tx = {};

	//notify progress
	//console.log(sqrTx);

	//define the tx name
	ahnuts_tx[sqrTx.id] = {
		created_at: parse_timestamp(sqrTx.created_at, location_id),
		device_id: parse_tx_device_id(sqrTx.device.id),
		device_name: sqrTx.device.name,
		salesDay: "",
		customer: "",
		employee_id: sqrTx.tender[0].employee_id,
		net_total_money: sqrTx.net_total_money.amount,
		tip_money: sqrTx.tip_money.amount,
		discount_money: sqrTx.discount_money.amount,
		processing_fee_money: sqrTx.processing_fee_money.amount,
		refunded_money: sqrTx.refunded_money.amount,
		gross_sales_money: sqrTx.gross_sales_money.amount,
		net_sales_money: sqrTx.refunded_money.amount,
		tender: map_sqr_tx_tender_to_ahnts_tx_tender(sqrTx.tender),
		itemizations: map_sqr_tx_itemizations_to_ahnts_tx_itemizations(sqrTx.itemizations)
	};

	//notify of progress
	//console.log(ahnuts_tx);

	return ahnuts_tx;
};

/*
*	MAP SQUARE TRANSACTION ITEMIZATION TO AH-NUTS TX ITEMIZATION
*
*	This function maps..
*
*	@param - 
* 	@return - 
*/
function map_sqr_tx_itemizations_to_ahnts_tx_itemizations(sqrItemizations) {
	//define local variables
	var newItemizationArray = [];

	//iterate through each tranaction
	sqrItemizations.forEach(function(itemization_tx) {
		
		//deal with anomolies
		if(itemization_tx.item_variation_name == undefined) itemization_tx.item_variation_name = itemization_tx.name;

		//define local variales
		var newItemization = {
			name: 					itemization_tx.name,
			quantity: 				itemization_tx.quantity,
			item_variation_id: 		itemization_tx.item_detail.item_id,
			item_variation_name: 	itemization_tx.item_variation_name,
			total_money: 			itemization_tx.total_money.amount,
			single_quantity_money: 	itemization_tx.single_quantity_money.amount,
			gross_sales_money: 		itemization_tx.gross_sales_money.amount,
			discount_money: 		itemization_tx.discount_money.amount,
			net_sales_money: 		itemization_tx.net_sales_money.amount,
			modifers: map_sqr_tx_mods_to_ahnts_tx_mods(itemization_tx.modifiers)
		};	

		//add to the array
		newItemizationArray.push(newItemization);
	});

	return newItemizationArray;	
};

/*
*	MAP SQUARE TRANSACTION ITEMIZATION TO AH-NUTS TX ITEMIZATION
*
*	This function maps..
*
*	@param - 
* 	@return - 
*/
function map_sqr_tx_tender_to_ahnts_tx_tender(sqrTender) {
	//define local variables
	var newTenderArray = [];

	//iterate through each tranaction
	sqrTender.forEach(function(tender_tx) {
		//define local variales
		var newTender = {
			total_money: tender_tx.total_money.amount,
			type: tender_tx.type
		};	

		//add to the array
		newTenderArray.push(newTender);
	});

	return newTenderArray;
};

/*
*	MAP SQUARE TRANSACTION MODIFIERS TO AH-NUTS TX MODIFERS
*
*	This function maps..
*
*	@param - 
* 	@return - 
*/
function map_sqr_tx_mods_to_ahnts_tx_mods(sqrMods) {
	//define local variables
	var newModsArray = [];

	//iterate through each tranaction
	sqrMods.forEach(function(modifier) {
		//define local variables
		var newMod = {
			name: 			 modifier.name,
			applied_money: 	 modifier.applied_money.amount,
			modifier_option: modifier.modifier_option_id
		};

		//add to array
		newModsArray.push(newMod);

	});

	return newModsArray;
};

/*
*	PARSE TIMESTAMP
*
*	This is used to...
*/
function parse_timestamp(timestamp, location_id) {
	//define local variables
	var location_tz_object = stdio.read.json('./models/ahnuts_locations.json');
	var tzTimestamp = moment.tz(timestamp, location_tz_object[location_id].timezone).format();
	
	//console.log('timezone:', tzTimestamp);

	return tzTimestamp;
};

/*
*	TEST
*
*	This is used to...
*/
function parse_tx_device_id(sqrDeviceId) {

	if(sqrDeviceId != undefined) {
		//define local variables
		var namesplit = sqrDeviceId.split(":");
		var ahnuts_device_id = namesplit[1];

		return ahnuts_device_id;		
	} else return 'UNKNOWN'

};

/*
*	TEST
*
*	This is used to test the module
*/
function test() { console.log('testing transaction data formating module'); }

//return the module
module.exports = data_formatting;


