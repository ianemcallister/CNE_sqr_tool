/*
*	AHNUTS CUSTOMERS FUNCTIONS
*
*	This is the Ah-nuts customer functions method
*/

//define dependencies
var firebase		= require('../firebase/firebase.js');
var stdio			= require('../stdio/stdio_api.js');

//define module
var ahcfn = {
	compile: {
		sales_days_list: compile_sales_days_list
	},
	add: {
		a_customer: add_a_customer,
		customers: add_customers
	}
};

//	COMPILE SALES DAY LIST
function compile_sales_days_list() {
	//define local variables
	
};

//	ADD A CUSTOMER 
function add_a_customer(customerName) {
	//define local variables
	var writePath = "customers";
	var customerObject = stdio.read.json('./models/customer_template.json');
	customerObject.display_name = customerName; 

	//return async work
	return new Promise(function(resolve, reject) {
		
		//performing async work
		firebase.push(writePath, customerObject).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});

	});

};

//	ADD CUSTOMERS
function add_customers(customersArray) {
	//define local variables
	var promisesArray = [];

	//iterate through all the customers
	customersArray.forEach(function(customerName) {

		//build array
		promisesArray.push(add_a_customer(customerName));

	});
	
	//run all the promises
	Promise.all(promisesArray).then(function success(s) {
		console.log("SUCCESS:", s);
	}).catch(function error(e) {
		console.log("ERROR:", e);
	});
};


//return the module
module.exports = ahcfn;

