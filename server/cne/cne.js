/*
*	CAPITALIST NUT ENTERPRISES MODULE 
*
*	This module contains the methods that ah-nuts uses to get work done.
*/

//declare dependencies
var square			= require('../square/sqr_api.js');
var stdio			= require('../stdio/stdio_api.js');
var sqrdata			= require('../square/sqr_data_api.js');
var sqlQryBldr = require('../mysql/query_builder.js');


//define module
var cne_api = {
	update: {
		table: {
			locations: update_locations_table,
			employees: update_employees_table,
			roles: update_roles_table,
			products: update_products_table,
			tickets: update_tickets_table
		}
	}
};

// UPDATE LOCATIONS TABLE
function update_locations_table() {
	//define local variables

	//load locations list from square
	var locationsJson = stdio.read.json('models/locations.json');
	
	//update mysql table
	sqlQryBldr.build.locations_insert(locationsJson);
};

// UPDATE EMPLOYEES TABLE
function update_employees_table() {
	//define local variables

	//load locations list from square
	var employeesJson = stdio.read.json('models/employees.json');
	
	//update mysql table
	sqlQryBldr.build.employees_insert(employeesJson);
};

// UPDATE EMPLOYEES TABLE
function update_roles_table() {
	//define local variables

	//load locations list from square
	var rolesJson = stdio.read.json('models/roles.json');
	
	//update mysql table
	sqlQryBldr.build.roles_insert(rolesJson);
};

// UPDATE EMPLOYEES TABLE
function update_products_table() {
	//define local variables

	//load locations list from square
	var productsJson = stdio.read.json('models/products.json');
	
	//update mysql table
	sqlQryBldr.build.products_insert(productsJson);
};

// UPDATE EMPLOYEES TABLE
function update_tickets_table() {
	//define local variables

	//load locations list from square
	var ticketsJson = stdio.read.json('models/tickets_test.json');
	
	//update mysql table
	sqlQryBldr.build.tickets_insert(ticketsJson);
};

//return the module
module.exports = cne_api;
