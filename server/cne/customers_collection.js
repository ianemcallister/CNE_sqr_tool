/*
*	AH-NUTS / CAPITALIST NUT ENTERPRISES:
*	CUSTOMERS COLLECTION MODULE
*
*	This module is the jumping off point for all 
*	maintenace related operations for ah-nuts.
*/

//define dependencies
var tasks			= require('./customers_collection_tasks.js');

//define local variables
var customers = {
	season: {
		add: add_customer_season
	}
};

function add_customer_season(customer_id, params) {
	//define local variables
	console.log('customers:add_customer_season');
	//return async work
	return new Promise(function(resolve, reject) {

		//start by downloading the transaction
		tasks.season.add(customer_id, params).then(function success(s) {
			//when the response comes back format it
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});

	});
};

//return the module
module.exports = customers;

