/*
*	LOCATION QUERIES API
*
*	This module facilitates mysql queries to the location table
*/

//define dependencies
var templatizer 	= require('../template_engine/templateizer.js');
var sqrdata			= require('../square/sqr_data_api.js');

//define module
var mysql_location_api = {
	build: {
		locations_insert: build_locations_insert,
		employees_insert: build_employees_insert,
		roles_insert: build_roles_insert,
		products_insert: build_products_insert
	}
};

//build locations insert
function build_locations_insert(jsonModel) {
	//define local variable
	var sqrLocationArray = sqrdata.locations.to_array(jsonModel);

	//read out result
	console.log(templatizer.JSON.toMysql({
		table: 'sqrLocation',
		params: ['id', 'name', 'timezone', 'status'],
		rows: sqrLocationArray
	}));

};

//build locations insert
function build_employees_insert(jsonModel) {
	//define local variable
	var employeesArray = sqrdata.employees.to_array(jsonModel);

	//read out result
	console.log(templatizer.JSON.toMysql({
		table: 'employee',
		params: ['id', 'first_name', 'last_name', 'status', 'updated_at', 'created_at', 'email'],
		rows: employeesArray
	}));

};

//build locations insert
function build_roles_insert(jsonModel) {
	//define local variable
	var rolesArray = sqrdata.roles.to_array(jsonModel);

	//read out result
	console.log(templatizer.JSON.toMysql({
		table: 'role',
		params: ['id', 'name', 'created_at', 'updated_at'],
		rows: rolesArray
	}));

};

//build locations insert
function build_products_insert(jsonModel) {
	//define local variable
	var productsArray = sqrdata.products.to_array(jsonModel);

	//read out result
	console.log(templatizer.JSON.toMysql({
		table: 'product',
		params: ['id', 'name', 'parent_item', 'category', 'sku', 'nut', 'flavor', 'oz', 'package_size', 'package_shape', 'COG', 'retail_price', 'wholesale_price'],
		rows: productsArray
	}));

};

//return the module
module.exports = mysql_location_api;
