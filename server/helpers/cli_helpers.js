/*
*	AH-NUTS / CAPITALIST NUT ENTERPRISES:
*	CLI HELPERS
*
*	This module...
*/

//define dependencies
//var cne				= require('../cne/cne.js');
//var mysql 			= require('./mysql/mysql_api.js');
//var square 			= require('./square/sqr_api.js');
//var templatizer 	= require('./template_engine/templateizer.js');
var stdio			= require('../stdio/stdio_api.js');
//var sqrdata			= require('./square/sqr_data_api.js');
//var locations_mysql = require('./mysql/query_builder.js');
var squareV1		= require('../square/v1_api.js');
//var ahnutsSqSync	= require('./square/ahnuts_sqr_tx_sync.js');
var firebase		= require('../firebase/firebase.js');
//var customerFns		= require('./cne/ahnuts_customers_fn.js'); 
//var salsesdaysFns	= require('./cne/ahnuts_sales_days_fn.js'); 
//var CNE				= require('./cne/cme_maintenance.js'); 
var maintenance 	= require('../cne/maintenance.js');
//var calendarFns		= require('./cne/ahnuts_calender_fn.js'); 
//var txFns			= require('./cne/ahnuts_transactions_fn.js');
var slingapi 		= require('../sling/api.js');

//define local variables
var cli_helper = {
	customers: {
		season: {
			add: add_customer_season
		}
	},
	ops: {
		allTx: all_db_tx_read,
		tx_blocks: {
			update: update_tx_blocks
		},
		sales_days: {
			repair: {
				ids: repair_sales_day_id
			}
		}
	},
	firebase: {
		create: create_firebase_record,
		push: push_firebase_record,
		read: read_firebase_record
	},
	sling: {
		accounts: {
			accessToken: sling_accounts_accessToken,
			login: sling_accounts_login
		},
		calendar: {
			summary: sling_calendar_summary
		}
	},
	stdio: {
		read: {
			json: stdio_read_json
		}
	},
	square: {
		cash_drawers: {
			list: cash_drawers_list
		},
		employees: {
			list: sqr_employees_list
		},
	},
	tests: {
		single_tx_sync: test_single_tx_sync,
		general: test,
		cne_sqr_tx_download: cne_sqr_tx_download,
		cne_sqr_employees_download: cne_sqr_employees_download,
		cne_sqr_locations_download: cne_sqr_locations_download
	}
};

function repair_sales_day_id() {
	return new Promise(function(resolve, reject) {
		maintenance.sales_days.repair.ids().then(function success(s) {
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});
	});	
};

function update_tx_blocks(batchRequest, pushObject) {
	return new Promise(function(resolve, reject) {
		maintenance.tx_blocks.update(batchRequest, pushObject).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});
	});	
};

function add_customer_season(customer_id, params) {
	
	return new Promise(function(resolve, reject) {
		maintenance.customers.season.add(customer_id, params).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});

	});

};


//
function sling_accounts_accessToken(username, pass) {
	
	return new Promise(function(resolve, reject) {
		slingapi.accounts.accessToken(username, pass).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});

	});

};

function sling_accounts_login(username, pass) {
	
	return new Promise(function(resolve, reject) {
		slingapi.accounts.login(username, pass).then(function success(s) {
			resolve('success', s);
		}).catch(function error(e) {
			reject('ERROR', e);
		});

	});

};

//	S
function sling_calendar_summary(token, dates) {
	
	return new Promise(function(resolve, reject) {
		slingapi.calendar.summaries(token, dates).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});
	});
};

function cne_sqr_locations_download() {
	maintenance.square.locations.list().then(function success(s) {
		console.log('success', s);
	}).catch(function error(e) {
		console.log('ERROR', e);
	});
};


function cne_sqr_employees_download(status, external_id, limit, order, begin_updated_at, end_updated_at, begin_created_at, end_created_at) {
	maintenance.square.employees.list(status, external_id, limit, order, begin_updated_at, end_updated_at, begin_created_at, end_created_at).then(function success(s) {
		console.log('success', s);
	}).catch(function error(e) {
		console.log('ERROR', e);
	});
};

function read_firebase_record(path) {
	return new Promise(function(resolve, reject) {
		firebase.read(path).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		})
	});
};

//cash_drawers_list
function sqr_employees_list(order, updatesTimes, createdTimes, status, externalId, limit) {
	//return async work
	return new Promise(function(resolve, reject) {
		//run function
		squareV1.employees.list(order, updatesTimes, createdTimes, status, externalId, limit).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		})

	});

};

//cash_drawers_list
function cash_drawers_list(location, times) {
	//return async work
	return new Promise(function(resolve, reject) {
		//run function
		squareV1.cash_drawers.list(location, times).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		})

	});

};

function stdio_read_json(filepath) {
	return stdio.read.json(filepath);
};

function push_firebase_record(path, data) {
	return new Promise(function(resolve, reject) {
		firebase.push(path, data).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		})
	});
}

//
function create_firebase_record(path, data) {
	//define local variables
	firebase.create(path, data).then(function success(s) {
		console.log('SUCCESS', s);
	}).catch(function error(e) {
		console.log('ERROR', e);
	});
};

//	TEST SINGLE TX SYNC
function test_single_tx_sync(entity_id, location_id) {
	//run function
	maintenance.transactions.sync.ahNuts_to_Square('single', { entity_id: entity_id, event_type: 'PAYMENT_UPDATED', merchant_id: 'FCGJQY3GC9BNW', location_id: location_id }).then(function success(s) {
			
		//return an affirmative status code
		console.log(s)

	}).catch(function error(e) {
		
		//return an error status code
		console.log(e)
		
	});

};

//	ALL DATABSE TRANSCATIONS READ
/*
*	This function reads all the transactions from the database
*/
function all_db_tx_read() {
	//define local variables
	var totalKeys = 0;
	var salesDays = {};
	var readPath = "transactions";

	//read databse
	firebase.read(readPath).then(function success(allTx) {
		
		//iterate through all transactions
		Object.keys(allTx).forEach(function(key) {

			//split the date
			var dateSplit = allTx[key].created_at.split("T");
			var theDate = dateSplit[0];
			var employee_id = allTx[key].employee_id;

			console.log(key, theDate, employee_id);

			//check for date currently active
			if(salesDays[theDate] == undefined) salesDays[theDate] = {};

			//add employees
			if(salesDays[theDate][employee_id] == undefined) salesDays[theDate][employee_id] = { tx: 0 };

			//incriment the counter
			//salesDays[theDate][employee_id].tx = parseInt(salesDays[theDate][employee_id].tx)++

			totalKeys++;
		});

		console.log("totalKeys:", totalKeys);
		console.log('salesDays', salesDays);
		stdio.write.json(salesDays, "salesDays_by_device.json");

	}).catch(function error(e) {

	});
}
	



/*
*	TEST
*
*	This is used to test the module
*/
function test() { console.log('testing cli_helper module'); }


function cne_sqr_tx_download() {
	maintenance.txs.download.from_square.by_device("M53KQT35YKE5C", "2018-07-19T00:00:00-07:00", "2018-07-19T23:59:59-07:00").then(function success(s) {
		
		console.log(s)

	}).catch(function error(e) {
		console.log(e);
	});
}


//return the module
module.exports = cli_helper;





/*

//.push_requests();

/*maintenance.transactions.sync.ahNuts_to_Square('batch').then(function success(s) {

	//return an affirmative status code
	console.log('success', s);

}).catch(function error(e) {
	
	//return an error status code
	console.log("error", e);

});*/


//console.log(ahnutsSqSync);

/*firebase.push('logs/tx_syncs', { timestamp: "2018-07-01T00:00:00Z", successful: true } ).then(function success(s) {

	//return an affirmative status code
	console.log('success', s);

}).catch(function error(e) {
	
	//return an error status code
	console.log("error", e);

});*/

/*
CNE.sync.an_txs_to_sqrt('batch').then(function success(s) {
		
	//return an affirmative status code
	console.log('success', s);

}).catch(function error(e) {
	
	//return an error status code
	console.log("error", e);

});*/

/*squareV1.payments.list('M53KQT35YKE5C', '2018-05-01T00:00:00Z', '2018-05-03T00:00:00Z').then(function success(s) {
	console.log('success', s.length);
}).catch(function error(e) {
	console.log("error", e);
})*/



/*var tx_date = "2018-07-10";
var emp_id = "xQjIXzpdO_xAivh-9e9F";
var writePath = 'reference_lists/CME_by_employee_and_date/' + tx_date + "/" + emp_id;

firebase.create(writePath, { 0: { "is_known": true, customer:"-LG7zzWIARLFo9__SwdR", salesDay:"-LGW8Fd1qcPdVXaEJaoJ"}}).then(function success(s) {
	console.log("success", s);
}).catch(function error(e) {
	console.log("error", e)
});*/


//ahnutsSqSync.single_tx_sync('TdeA1fel6UysVdEGFH5rKQB', 'M53KQT35YKE5C');


//cme.calculate.salesday_summary('-LGW19FaJ-c3p8FzuVJo');


//calendarFns.sync.sales_days_to_calendar();

//txFns.batch.move_txs('sales_days/-LGW6w5gsL1Kff8Gt2MB /transactions', 'sales_days/-LGW6w5gsL1Kff8Gt2MB/transactions');


//cme.sync.sales_days_to_customers();


/*var known_cme_object = cme.check.known_cme( {
	JAMRfRgDpZvisJ8n6DvXLQB: {
		created_at: "2018-07-02T17:38:43-07:00",
		employee_id: "4ISdMmC7SkAyDQL_DB87"
	}
}).then(function success(s) {
	console.log("success", s);
}).catch(function error(e) {
	console.log("error", e)
});*/



//customerFns.add.customers(stdio.read.json('./models/customers.json'));

/*var newArray = salsesdaysFns.compile.new_sales_days_batch({
		customer: "Beaverton",
		season: "2018_Summer",
		bookend_dates: {
			first: "2018-05-05",
			last: "2018-09-29"
		},
		repeats: "every_week",
		event_days: {
			0: false,
			1: false,
			2: false,
			3: false,
			4: false,
			5: false,
			6: true
		},
		same_day_load_in_out: true,
		schedule: {
			load_in: "2018-05-05T06:00:00-07:00",
			load_out: "2018-05-05T14:30:00-07:00",
			open: "2018-05-05T06:00:00-07:00",
			close: "2018-05-05T14:30:00-07:00",
			sales_start: "2018-05-05T08:00:00-07:00",
			sales_end: "2018-05-05T13:30:00-07:00"
		}
	});*/

//console.log(newArray);


//var calObject = calendarFns.add.date_range("2018-01-01", "2018-12-31");

/*firebase.create('calender/2018', calObject).then(function success(s) {
	console.log('success', s);
}).catch(function error(e) {
	console.log("error", e);
})*/




