/*
*	AH-NUTS SQUARE TRANSACTION SYNC 
*
*	This module is a connection between the ah-nuts databse and square.  It handles 
*	all function around syncing transactions between the two databses.
*/

//define dependencies
var v1_api_sqr 		= require('./v1_api.js');
var firebase		= require('../firebase/firebase.js');
var stdio 			= require('../stdio/stdio_api.js');
var cme				= require('../cne/cme_maintenance.js'); 
var moment 			= require('moment-timezone');


//define settings
//moment().tz().format();

//define module
var an_sqr_tx_sync = {
	batch_requests: batch_requests,
	push_requests: push_requests,
	single_tx_sync: single_tx_sync,
	map_sqr_tx_to_ahnts_tx: map_sqr_tx_to_ahnts_tx,
	map_sqr_tx_tender_to_ahnts_tx_tender: map_sqr_tx_tender_to_ahnts_tx_tender,
	map_sqr_tx_itemizations_to_ahnts_tx_itemizations: map_sqr_tx_itemizations_to_ahnts_tx_itemizations,
	map_sqr_tx_mods_to_ahnts_tx_mods: map_sqr_tx_mods_to_ahnts_tx_mods,
	map_sqr_tx_device_id_to_ahnuts_tx_dev_id: map_sqr_tx_device_id_to_ahnuts_tx_dev_id,
	parse_timestamp: parse_timestamp,
	save_tx_to_ahnuts_server: save_tx_to_ahnuts_server,
	save_tx_id_to_ahnuts_ref_lists: save_tx_id_to_ahnuts_ref_lists,
	add_tx_to_ahnuts_db: add_tx_to_ahnuts_db
};

/*
*	MISC FUNCTIONS
*/
// 
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

//
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
	
//
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

// MAP SQUARE TRANSACTION DEVICE IDE TO AH NUTS TRANSACTION DEVICE ID
function map_sqr_tx_device_id_to_ahnuts_tx_dev_id(sqrDeviceId) {
	//define local variables
	var namesplit = sqrDeviceId.split(":");
	var ahnuts_device_id = namesplit[1];

	return ahnuts_device_id;
};

//
function map_sqr_tx_to_ahnts_tx(sqrTx, location_id) {
	//define local variables
	var ahnuts_tx = {};

	//console.log(sqrTx);

	//define the tx name
	ahnuts_tx[sqrTx.id] = {
		created_at: parse_timestamp(sqrTx.created_at, location_id),
		device_id: map_sqr_tx_device_id_to_ahnuts_tx_dev_id(sqrTx.device.id),
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

	console.log(ahnuts_tx);

	return ahnuts_tx;
};

// PARES TIMESTAMP
function parse_timestamp(timestamp, location_id) {
	//define local variables
	var location_tz_object = stdio.read.json('./models/ahnuts_locations.json');
	var tzTimestamp = moment.tz(timestamp, location_tz_object[location_id].timezone).format();
	
	//console.log('timezone:', tzTimestamp);

	return tzTimestamp;
}

// SAVE TRANSACTION TO AHNUTS SERVER
function save_tx_to_ahnuts_server(tx_id, ahnutstx) {
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

// SAVE TRANSACTION ID TO THE AHNUTS REFERENCE LIST
function save_tx_id_to_ahnuts_ref_lists(tx_id, ahnutstx) {
	//define local variables
	var splitDatetime = ahnutstx[tx_id].created_at.split('T')
	var writePath = 'reference_lists/unassigned_txs/' + ahnutstx[tx_id].device_id + "/" + splitDatetime[0];
	
	//return async work
	return new Promise(function(resolve, reject) {
		firebase.push(writePath, tx_id).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});
	});
};

/*
*	SINGLE TRANSACTION SYNC
*
*	This function downloads a specific transaction from square then adds it to the ah-nuts
*	database.
*/
function single_tx_sync(entity_id, location_id) {
	//define local variables
	
	//download tx from square
	v1_api_sqr.payments.retrieve(entity_id, location_id).then(function success(s) {

		//notify of returning object
		//console.log(s);
		add_tx_to_ahnuts_db(entity_id, s, location_id).then(function success(ss) {
			console.log('tx added to db successfully', ss);
		}).catch(function error(ee) {
			console.log('error adding tx to ahnuts db', ee);
		});

	}).catch(function error(e) {
		console.log('error', e);
	});

	//
};

/*
*	ADD TX TO AHNUTS DB
*
*	
*/	
function add_tx_to_ahnuts_db(tx_id, tx, location_id) {
	//define local variables

	//map square object to ah-nuts object
	var ahnuts_tx = map_sqr_tx_to_ahnts_tx(tx, location_id);

	//return async work
	return new Promise(function(resolve, reject) {

		//check for reference transaction status
		cme.check.known_cme(ahnuts_tx).then(function success(known_cme) {

			//check for known status
			if(known_cme.is_known) {

				//notify progress
				console.log('tx known, saving to sales day');
				
				//if we know where this transaction shoudl go....
				//ADD a customer to the transaction
				ahnuts_tx.customer = known_cme.customer;
				//ADD a salesday to the transaction
				ahnuts_tx.salesDay = known_cme.salesDay;
				
				//ADD the transaction to the correct SalesDay
				var salesDayPath = 'sales_days/' + known_cme.salesDay + "/transactions"
				firebase.push(salesDayPath, tx_id).then(function success(s) {

					console.log("success", s);

					//RECALCULATE salesDay sums

				}).catch(function error(e) {
					console.log("error", e);
				});

				
			} else {
				//notify
				console.log('tx cme unknown ,saving to reference list');

				//for the time being, save the transaction id to the unassigned_txs list
				save_tx_id_to_ahnuts_ref_lists(tx_id, ahnuts_tx).then(function success(s) {
					console.log('success', s);
				}).catch(function error(e) {
					console.log('error', e);
				});

			}

			//	IN ALL CASES

			//	SAVE THE TRANSACTION TO THE TRANSACTIONS COLLECTION
			save_tx_to_ahnuts_server(tx_id, ahnuts_tx).then(function success(s) {
				resolve(s);
			}).catch(function error(e) {
				reject(e);
			});

			
			//if is a reference transaction....
			//if is NOT a reference transaction...

		}).catch(function error(e) {
			console.log("error", e);
		});

	});

};

/*
*	BATCH REQUESTS
*/
function batch_requests(start, end) {
	//define local variables
	
}

/*
*	PUSH REQUESTS
*	
*	This function picks the appropriate function based on the push request.
*/
function push_requests(pushObject) {
	//define local variables
	var entity_id = pushObject.entity_id;
	var location_id = pushObject.location_id;
	var pushCase = { "PAYMENT_UPDATED": 1 };

	//handle the appropriate case
	switch(pushCase[pushObject.event_type]) {
		case 1:
			//payment updated
			single_tx_sync(entity_id, location_id);
			break;
		case 2:
			break;
		case 3:
			break;
		default:
			break;
	};


}



//return the module
module.exports = an_sqr_tx_sync;


