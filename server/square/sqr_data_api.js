/*
*	SQUARE DATA API 
*
*	This module converts square data in to more usable formats
*/

//define dependencies
var stdio = require('../stdio/stdio_api.js');

//define module
var sqr_data_api = {
	_dateChecker: _date_checker,
	locations: {
		to_array: locations_to_array
	},
	employees: {
		to_array: employees_to_array
	},
	roles: {
		to_array: roles_to_array
	},
	products: {
		_ref: products_ref,
		_valueMapping: {
			category: products_value_map_category,
			sku: products_value_map_sku,
			flavor: products_value_map_flavor,
			oz: products_value_map_oz,
			pkg_size: products_value_map_pkg_size,
			pkg_shape: products_value_map_pkg_shape,
			COG: products_value_map_COG,
			retail: products_value_map_retail,
			wholesale: products_value_map_wholesale
		},
		sqr_to_sql: sqr_products_to_sql, 
		to_array: products_to_array
	},
	devices: {
		tx_to_device_list: tx_to_device_list
	},
	transactions: {
		_flvr_mix_calc: _flvr_mix_calc,
		to_object: txs_to_object
	},
	selection: {
		filter: filter_txs
	}
};

// DATE CHECKER
/*
*	Confirms that transactions fall within given paramaters
*/
function _date_checker(tx, first, last) {
	//define local variables

	return true
};

//	LOCATIONS TO ARRAY
function locations_to_array(jsonModel) {
	//define local variables
	var returnArray = [];

	//iterate through each location
	jsonModel.locations.forEach(function(location) {

		var localArray = [];

		//add id
		localArray.push(location.id);

		//add name
		localArray.push(location.name);

		//add timezone
		localArray.push(location.timezone);

		//add status
		localArray.push(location.status);

		//add the local array to the return array
		returnArray.push(localArray);

	});

	//return the model
	return returnArray;
};	

//	EMPLOYEES TO ARRAY
function employees_to_array(jsonModel) {
	//define local variables
	var returnArray = [];

	//iterate through each employee
	jsonModel.forEach(function(employee) {

		var localArray = [];

		//add id
		localArray.push(employee.id);

		//add first_name
		localArray.push(employee.first_name);

		//add last_name
		localArray.push(employee.last_name);

		//add status
		localArray.push(employee.status);

		//add updated_at
		localArray.push(employee.updated_at);

		//add created_at
		localArray.push(employee.created_at);

		//add email
		localArray.push(employee.email);

		//add the local array to the return array
		returnArray.push(localArray);

	});

	//return the model
	return returnArray;
};	

//	ROLES TO ARRAY
function roles_to_array(jsonModel) {
	//define local variables
	var returnArray = [];

	//iterate through each role
	jsonModel.forEach(function(role) {

		var localArray = [];

		//add id
		localArray.push(role.id);

		//add name
		localArray.push(role.name);

		//add created_at
		localArray.push(role.created_at);

		//add updated_at
		localArray.push(role.updated_at);


		//add the local array to the return array
		returnArray.push(localArray);

	});

	//return the model
	return returnArray;
};	

//	PRODUCTS PRICE LIST REFERENCE
function products_ref(key, product, variation) {
	//define local variables
	var returnValue = "";
	var pricelist = stdio.read.json('models/pricelist.json');

	//console.log(pricelist);

	//confirm that product exists in price list
	if(pricelist[product] != undefined) {

		if(pricelist[product].variations[variation] != undefined) {

			if(key == "nut") returnValue = pricelist[product].nut;
			else if(key == "flavor") returnValue = pricelist[product].flavor;
			else if(key == "oz") returnValue = pricelist[product].variations[variation].oz;
			else if(key == "pkg_size") returnValue = pricelist[product].variations[variation].pkg_size;
			else if(key == "pkg_shape") returnValue = pricelist[product].pkg_shape;
			else if(key == "COG") returnValue = pricelist[product].variations[variation].COG;
			else if(key == "wholesale") returnValue = pricelist[product].variations[variation].wholesale;
			else if(key == 'retail') {

				if(variation.price_money != undefined) returnValue = variation.price_money.amount;
				else returnValue = "";
			}

		} else returnValue = "";
		
	} else returnValue = "";

	return returnValue;
};

//	SQUARE PRODUCTS MODEL TO ID BASED MODEL (SQL FRIENDLY)
function sqr_products_to_sql(products) {
	//define local variables
	var idProductsList = {};

	//iterate through all the products
	products.forEach(function(product) {
		//define local variables

		//iterate through all variations
		product.variations.forEach(function(variation) {

			console.log(product.name + " " + variation.name);

			//add the product id to the object
			idProductsList[variation.id] = {
				parentId: variation.item_id,
				name: product.name + " " + variation.name,
				category: products_value_map_category(product, variation),
				sku: products_value_map_sku(product, variation),
				nut: products_value_map_nut(product, variation),
				flavor: products_value_map_flavor(product, variation),
				oz: products_value_map_oz(product, variation),
				pkg_size: products_value_map_pkg_size(product, variation),
				pkg_shape: products_value_map_pkg_shape(product, variation),
				COG: products_value_map_COG(product, variation),
				retail: products_value_map_retail(product, variation),
				wholesale: products_value_map_wholesale(product, variation)
			};

		});

	});

	return idProductsList;
};

//these all return required values 
function products_value_map_category(product, variation) {
	if(product.category != undefined)
		if(product.category.name != undefined) return product.category.name
		else return "";
	else return "";
};

function products_value_map_sku(product, variation) {
	if(variation.sku != undefined) return variation.sku
	else return "";
};

function products_value_map_nut(product, variation) {
	//console.log('products_value_map_nut');
	var nutkey = stdio.read.json("models/product_list_by_name.json");
	var pdct_name = product.name;
	if(variation.name != "") {
		pdct_name = pdct_name + " " + variation.name;
	}
	return nutkey[pdct_name].nut;
};

function products_value_map_flavor(product, variation) {
	var flavorkey = stdio.read.json("models/product_list_by_name.json");
	var pdct_name = product.name;
	if(variation.name != "") {
		pdct_name = pdct_name + " " + variation.name;
	}
	return flavorkey[pdct_name].flavor;
};

function products_value_map_oz(product, variation) {
	var ozkey = stdio.read.json("models/product_list_by_name.json");
	var pdct_name = product.name;
	if(variation.name != "") {
		pdct_name = pdct_name + " " + variation.name;
	}
	return ozkey[pdct_name].oz;
};

function products_value_map_pkg_size(product, variation) {
	var pkgkey = stdio.read.json("models/product_list_by_name.json");
	var pdct_name = product.name;
	if(variation.name != "") {
		pdct_name = pdct_name + " " + variation.name;
	}
	return pkgkey[pdct_name].pkg_size;
};

function products_value_map_pkg_shape(product, variation) {
	var pkgkey = stdio.read.json("models/product_list_by_name.json");
	var pdct_name = product.name;
	if(variation.name != "") {
		pdct_name = pdct_name + " " + variation.name;
	}
	return pkgkey[pdct_name].pkg_shape;
};

function products_value_map_COG(product, variation) { return 0; };

function products_value_map_retail(product, variation) {
	var priceKey = { "4": 700, "8": 1300, "16": 1800, "20": 2200, "null": null, "52": null };
	var pkgkey = stdio.read.json("models/product_list_by_name.json");
	var pdct_name = product.name;
	if(variation.name != "") {
		pdct_name = pdct_name + " " + variation.name;
	}
	//console.log(pdct_name, priceKey[pkgkey[pdct_name].oz]);
	return pdct_name, priceKey[pkgkey[pdct_name].oz];
};

function products_value_map_wholesale(product, variation) { return 0; };

//	PRODUCTS TO ARRAY
function products_to_array(jsonModel) {
	//define local variables
	var returnArray = [];

	//iterate through each product
	jsonModel.forEach(function(product) {

		//define local array
		var localArray = [];

		//iterate through all iterations
		product.variations.forEach(function(variation) {

			console.log(product.name, variation.name);

			//add id
			localArray.push(variation.id);

			//add name
			localArray.push(variation.name);

			//add item_variation_name
			localArray.push(variation.item_id);
			
			//add category
			localArray.push("");//product.category.name);

			//add sku
			localArray.push(variation.sku);
			
			//add nut
			localArray.push(products_ref('nut', product.name, variation.name));

			//add flavor
			localArray.push(products_ref('flavor', product.name, variation.name));

			//add oz
			localArray.push(products_ref('oz', product.name, variation.name));
			
			//add package_size
			localArray.push(products_ref('pkg_size', product.name, variation.name));
			
			//add package_shape
			localArray.push(products_ref('pkg_shape', product.name, variation.name));
			
			//add COG
			localArray.push(products_ref('COG', product.name, variation.name));

			//add retail_price
			localArray.push(products_ref('retail', product.name, variation.name));

			//add wholesale_price
			localArray.push(products_ref('wholesale', product.name, variation.name));

			//add the local array to the return array
			returnArray.push(localArray);

		});

	});

	//return the model
	return returnArray;
};	

// 
/*
*	Accept a list of transactions from square and return a list of devices
*/
function tx_to_device_list(txsList) {

	var device_id_list = {};
	var device_name_list = {};
	//iterate through all transactions
	txsList.forEach(function(tx) {

		if(device_id_list[tx.device.id] == undefined) device_id_list[tx.device.id] = 0
		else device_id_list[tx.device.id]++;

		if(device_name_list[tx.device.name] == undefined) device_name_list[tx.device.name] = 0
		else device_name_list[tx.device.name]++;
	});

	return { "ids": device_id_list, "names": device_name_list };
};

//	FLAVORS MIX CALCULATOR
/*
*	takes a list of modifers and returns mix proportions
*/
function _flvr_mix_calc(modifiers) {
	//define local variables
	var flvMix = stdio.read.json('models/flvrs_prtns.json');
	var flvrMods = stdio.read.json('models/flv_list.json');
	var noFlvrs = modifiers.length;

	//iterate through modifiers
	modifiers.forEach(function(aMod) {

		flvMix[flvrMods[aMod.modifier_option_id]] = 1 / noFlvrs;
	});

	return flvMix;
}

//	TRANSACTIONS TO OBJECT
/*
*	Square transactions objects are turned into ah-nuts ticket Objects
*/
function txs_to_object(txsList) {
	//define local variables
	var anTickets = {};
	var anTicket_items = [];

	//iterate through each transaction
	txsList.forEach(function(tx) {
		//define local variables
		var itemization = {
			ticket_id: tx.id
		};

		//iterate through the items on this ticket
		tx.itemizations.forEach(function(anItem) {

			itemization["product_id"] = anItem.item_detail.item_variation_id
			itemization["invoice_id"] = "",
			itemization["oz"] = "",
			itemization["qty"] = anItem.quantity,
			itemization["total_money"] = anItem.total_money.amount,
			itemization["single_quantity_money"] = anItem.single_quantity_money.amount,
			itemization["gross_sales_money"] = anItem.gross_sales_money.amount,
			itemization["discount_money"] = anItem.discount_money.amount,
			itemization["net_sales_money"] = anItem.net_sales_money.amount,
			itemization["srPecn"] = _flvr_mix_calc(anItem.modifiers).srPecn,
			itemization["srAlm"] = _flvr_mix_calc(anItem.modifiers).srAlm,
			itemization["srCsh"] = _flvr_mix_calc(anItem.modifiers).srCsh,
			itemization["srPnt"] = _flvr_mix_calc(anItem.modifiers).srPnt,
			itemization["cnPcn"] = _flvr_mix_calc(anItem.modifiers).cnPcn,
			itemization["cnAlm"] = _flvr_mix_calc(anItem.modifiers).cnAlm,
			itemization["cnHzl"] = _flvr_mix_calc(anItem.modifiers).cnHzl,
			itemization["drPcn"] = _flvr_mix_calc(anItem.modifiers).drPcn

		});

		//add itemization to array
		anTicket_items.push(itemization);

		//create and object for each transaction
		anTickets[tx.id] = {
			location_id: "",
			creator_id: tx.tender[0].employee_id,
			created_at: tx.created_at,
			device_id: tx.device.id,
			device_name: tx.device.name,
			invoice_id: "",
			payment_url: tx.payment_url,
			inclusive_tax_money: tx.inclusive_tax_money.amount,
			additive_tax_money: tx.additive_tax_money.amount,
			tip_money: tx.tip_money.amount,
			discount_money: tx.discount_money.amount,
			total_collected_money: tx.total_collected_money.amount,
			processing_fee_money: tx.processing_fee_money.amount,
			net_total_money: tx.net_total_money.amount,
			refunded_money: tx.refunded_money.amount,
			gross_sales_money: tx.gross_sales_money.amount,
			net_sales_money: tx.net_sales_money.amount,
		};

	});

	//return object
	return {tickets: anTickets, items: anTicket_items} ;
};

//
/*
*
*/
function filter_txs(txs, device, start, end) {
	//define local variables
	var returnArray = [];

	//iterate through all of the transactions
	txs.forEach(function(tx) {
		//define local variables

		//select only transactions that meet the requirnments
		if(tx.device.id == device && _date_checker(tx, start, end)) {

			//add the transaction to the selects array
			returnArray.push(tx);
		};

	});

	return returnArray;
};

//return the module
module.exports = sqr_data_api;

