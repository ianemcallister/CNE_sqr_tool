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
		timezone_offset: timezone_offset
	},
	calculate: {
		financial: {
			sums: calculate_financial_sums,
			tx_types: calculate_tx_types
		},
		mfg: {
			sums: calculate_mfg_sums
		}
	},
	map: {
		sq_tx_to_ahNuts_tx: map_sq_tx_to_ahNuts_tx,
		sq_tx_itmz_to_ahNuts: map_sqr_tx_itemizations_to_ahnts_tx_itemizations,
		sq_tx_tender_to_ahNuts: map_sqr_tx_tender_to_ahnts_tx_tender,
		sq_tx_mods_to_ahNuts: map_sqr_tx_mods_to_ahnts_tx_mods
	},
	parse: {
		last_batch_sync: format_sync_log,
		tx_timestamp: parse_timestamp,
		tx_device_id: parse_tx_device_id,
		sq_txs_to_by_device_list: parse_sq_txs_to_by_device_list
	},
	format: {
		block_txs: {
			id: format_block_txs_id,
			object: format_block_txs_object
		}
	},
	test: test
};

function timezone_offset(location_id) {
	//define local variables
	var returnString = "";

	var locationsHash = { "M53KQT35YKE5C": "-07:00" }

	if(locationsHash[location_id] != undefined)
		returnString = locationsHash[location_id];

	//return string
	return returnString;
}

// FORMAT BLOCK TRANSACTION OBJECT
function format_block_txs_object(sqrTx, location_id, employeesList, locationsList, currentBlock) {
	//define local value
	var returnObject = stdio.read.json('./models/txs_block.json');
	var timezoneOffset = timezone_offset(location_id);
	var employeeName = "";
	var locationName = "";

	var dateObject = new Date(sqrTx.created_at);
	var fullDate = moment(dateObject).format();
	var splitDate = fullDate.split("T");
	var date = splitDate[0];

	var txMoment = moment(sqrTx.created_at).utcOffset(timezoneOffset);
	var txTime = txMoment.utcOffset(timezoneOffset).format();

	console.log('txTime', txTime);

	//iterate through employees list
	employeesList.forEach(function(employee) {
		if(employee.id == sqrTx.tender[0].employee_id) employeeName = employee.first_name + " " + employee.last_name;
	});

	//iterate through locations list
	locationsList.forEach(function(location) {
		if(location.id == location_id) locationName = location.name;
	});

	//update values
	returnObject.date = date;
	returnObject.device_id = sqrTx.device.id;
	returnObject.device_name = sqrTx.device.name;
	returnObject.employee_id = sqrTx.tender[0].employee_id;
	returnObject.employee_name = employeeName;
	returnObject.location_id = location_id;
	returnObject.location_name = locationName;

	//if current block exists
	if(currentBlock != undefined) {

		//notifing progress
		console.log('current block was defined, updating it\'s txs');

		//copy the existing object
		returnObject.splits = currentBlock.splits;

		//iterate through the splits
		Object.keys(currentBlock.splits).forEach(function(key) {
			
			var splitObject = currentBlock.splits[key];

			var windowStart = splitObject.window.split("/")[0];
			var windowFinish = splitObject.window.split("/")[1];
			
			var isBetween = txMoment.isBetween(windowStart, windowFinish);

			//console.log('isBetween', windowStart, windowFinish, isBetween);

			//check the tx time against the split window
			if(isBetween) {
				//notify progress
				console.log('is between the window times');

				//make sure the tx is listed in with the object
				returnObject.splits[key].txs[txTime] = sqrTx.id;

			} else {
				//will have to create a new block
				console.log('not between the window dates, need new split');

				//returnObject.splits[key].txs['holding'] = 'placeholder';
			};

		});

		

	} else {
		
		//notify progress
		console.log('currentBlock was undefined, defining it\'s splis now');

		//if no block was found we have to create the needed values
		returnObject.splits["01"] = stdio.read.json('./models/txs_block_splits.json');

		//add the window times
		returnObject.splits["01"].window = date + "T00:00:00" + timezoneOffset + "/" + date + "T23:59:59" + timezoneOffset;


		//add the tx object
		returnObject.splits["01"].txs[txTime] = sqrTx.id
	}

	//return value
	return returnObject;
};

// FORMAT BLOCK TRANSACTIONS
function format_block_txs_id(sqrTx, location_id) {
	//define local variables
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
	var block_id = date + employee_id + device_id;

	//return value
	return block_id;
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
	//define local variables
	var namesplit = sqrDeviceId.split(":");
	var ahnuts_device_id = namesplit[1];

	return ahnuts_device_id;
};

/*
*	TEST
*
*	This is used to test the module
*/
function test() { console.log('testing transaction data formating module'); }

//return the module
module.exports = data_formatting;


