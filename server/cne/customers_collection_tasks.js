/*
*	AH-NUTS / CAPITALIST NUT ENTERPRISES:
*	CUSTOMERS COLLECTION TASKS MODULE
*
*	This module is the jumping off point for all 
*	maintenace related operations for ah-nuts.
*/

//define dependencies
var firebase		= require('../firebase/firebase.js');

//define local variables
var tasks = {
	season: {
		add: add_customer_season
	}
};

function add_customer_season(customer_id, params) {
	//define local variables
	var writePath = "customers/" + customer_id + "/seasons"

	console.log('customers_tasks:add_customer_season');
	//return async work
	return new Promise(function(resolve, reject) {

		firebase.push(writePath, params).then(function success(s) {
			//when successfully written, follow up by writing id
			var newWritePath = writePath + "/" + s.id + "";

			firebase.update(newWritePath, { id: s.id}).then(function success(ss) {
				resolve(ss);
			}).catch(function error(ee) {
				reject(ee);
			});
			
		}).catch(function error(e) {
			reject(e);
		});

	});
}

//return the module
module.exports = tasks;

