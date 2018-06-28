/*
*	SQUARE 
*
*	This module serves as the connection between Ah-Nuts Server and SquareUp.com.
*/

//define dependencies
var SquareConnect 	= require('square-connect');
var defaultClient 	= SquareConnect.ApiClient.instance;

// Configure OAuth2 access token for authorization: oauth2
var _oauth2 		= defaultClient.authentications['oauth2'];
_oauth2.accessToken = process.env.SQUARE_APP_TOKEN;

//define module
var square_api = {
	_services: {

	},
	tickets: {
		_all_paginated_payments: _all_paginated_payments,
		list: payments_list
	},
	locations: {
		list: locations_list
	},
	employees: {
		list: employees_list
	},
	roles: {
		list: roles_list
	},
	products: {
		list: products_list
	}
};

//BUSINESS & LOCATIONS FUNCTIONS 

/*
*	LIST LOCATIONS
*	
*	Provides details for a business' locations, including their IDs.
*	The account_capabilities array returned in each Merchant object 
*	indicates which account capabilities the location has enabled. For 
*	example, if this array does not include the value CREDIT_CARD_PROCESSING, 
*	the location cannot currently process credit cards with Square.
*
*	Required permissions: MERCHANT_PROFILE_READ
*
*	Return Value:
*	An array of Merchant objects containing profile information for the 
*	business' locations.
*
*	Example:
*	[
	  {
	    "id": "JGHJ0343",
	    "name": "Dave Davis",
	    "email": "dave@example.com",
	    "country_code": "US",
	    "language_code": "en-US",
	    "currency_code": "USD",
	    "business_name": "Dave's Milkshakes",
	    "business_address": {
	      "address_line_1": "1455 Market St",
	      "locality": "San Francisco",
	      "administrative_district_level_1": "CA",
	      "postal_code": "94103"
	    },
	    "business_phone": {
	      "calling_code": "+1",
	      "number": "4155551234"
	    },
	    "business_type": "restaurants",
	    "shipping_address": {
	      "address_line_1": "1455 Market St",
	      "locality": "San Francisco",
	      "administrative_district_level_1": "CA",
	      "postal_code": "94103"
	    },
	    "account_type": "LOCATION",
	    "location_details": {
	      "nickname": "Milkshakes"
	    },
	    "market_url": "https://mkt.com/squared",
	    "account_capabilities": ["CREDIT_CARD_PROCESSING"]
	  }
*	]
*/
function locations_list() {
	//define local variables 
	var api = new SquareConnect.LocationsApi();

	//return async content
	return new Promise(function(resolve, reject) {
		
		//calling the endpoint
		api.listLocations().then(function(data) {
				
			//notifying successful call
			console.log('LocationsAPI called successfully. Returning data');
		  	
		  	//returning data
			resolve(data)
			//resolve('locations success');

		}, function(error) {

			//returning error on unsucessful call
			reject(error);
		});

	});

};

//EMPLOYEES FUNCTIONS 
function employees_list() {
	//define local variables 
	var api = new SquareConnect.V1EmployeesApi();
	var opts = { 
	  'order': "ASC", // String | The order in which employees are listed in the response, based on their created_at field.      Default value: ASC 
	  //'beginUpdatedAt': "beginUpdatedAt_example", // String | If filtering results by their updated_at field, the beginning of the requested reporting period, in ISO 8601 format
	  //'endUpdatedAt': "endUpdatedAt_example", // String | If filtering results by there updated_at field, the end of the requested reporting period, in ISO 8601 format.
	  //'beginCreatedAt': "beginCreatedAt_example", // String | If filtering results by their created_at field, the beginning of the requested reporting period, in ISO 8601 format.
	  //'endCreatedAt': "endCreatedAt_example", // String | If filtering results by their created_at field, the end of the requested reporting period, in ISO 8601 format.
	  //'status': "status_example", // String | If provided, the endpoint returns only employee entities with the specified status (ACTIVE or INACTIVE).
	  //'externalId': "externalId_example", // String | If provided, the endpoint returns only employee entities with the specified external_id.
	  'limit': 200, // Number | The maximum integer number of employee entities to return in a single response. Default 100, maximum 200.
	  //'batchToken': "batchToken_example" // String | A pagination cursor to retrieve the next set of results for your original query to the endpoint.
	};

	//return async content
	return new Promise(function(resolve, reject) {
		
		//calling the endpoint
		api.listEmployees(opts).then(function(data) {
				
			//notifying successful call
			console.log('listEmployees called successfully. Returning data');
		  	
		  	//returning data
			resolve(data)
			//resolve('roles success');

		}, function(error) {

			//returning error on unsucessful call
			reject(error);
		});

	});
};

//ROLES FUNCTIONS 
function roles_list() {
	//define local variables 
	var api = new SquareConnect.V1EmployeesApi();
	var opts = { 
		'order': "ASC", // String | The order in which employees are listed in the response, based on their created_at field.Default value: ASC 
		'limit': 200//, // Number | The maximum integer number of employee entities to return in a single response. Default 100, maximum 200.
		//'batchToken': "batchToken_example" // String | A pagination cursor to retrieve the next set of results for your original query to the endpoint.
	};

	//return async content
	return new Promise(function(resolve, reject) {
		
		//calling the endpoint
		api.listEmployeeRoles(opts).then(function(data) {
				
			//notifying successful call
			console.log('listEmployeeRoles called successfully. Returning data');
		  	
		  	//returning data
			resolve(data)
			//resolve('roles success');

		}, function(error) {

			//returning error on unsucessful call
			reject(error);
		});

	});
};

//PAYMENTS FUNCTIONS 
function _all_paginated_payments(batch_token, locationId, opts) {
	//define local variables
	var self = this;
	var api = new SquareConnect.V1TransactionsApi();

	console.log('in _all_paginated_payments',  batch_token, locationId, opts);

	//return async work
	return new Promise(function(resolve, reject) {
		//check for token
		if(batch_token) {
			
			api.listPaymentsWithHttpInfo(locationId, opts).then(function(resp) {

				//check for a batch token
				var nextLink = resp.response.links.next;
				var rawToken = nextLink.split('https://connect.squareup.com/v1/M53KQT35YKE5C/payments?batch_token=');
				var isolateToken = rawToken[1].split('&begin_time');
				
				var batch_token = isolateToken[0];
				opts['batch_token'] = batch_token;

				console.log('got this token', batch_token);
				
				self._all_paginated_payments(batch_token, locationId, opts)
				.then(function(success) {
					resolve();
				}).catch(function(error) {
					reject();
				});
				resolve();

			}, function(error) {
				console.error(error);
			});

		} else {
			reject();
		}
		
	});
};

function payments_list() {
	//define local variables
	var self = this;
	var api = new SquareConnect.V1TransactionsApi();

	var locationId = "M53KQT35YKE5C"; // String | The ID of the location to list payments for. If you specify me, this endpoint returns payments aggregated from all of the business's locations.
	var opts = { 
		'order': "ASC", // String | The order in which payments are listed in the response.
		'beginTime': "2018-05-01T12:00:00-08:00", // String | The beginning of the requested reporting period, in ISO 8601 format. If this value is before January 1, 2013 (2013-01-01T00:00:00Z), this endpoint returns an error. Default value: The current time minus one year.
		'endTime': "2018-05-10T12:00:00-08:00", // String | The end of the requested reporting period, in ISO 8601 format. If this value is more than one year greater than begin_time, this endpoint returns an error. Default value: The current time.
		'limit': 200, // Number | The maximum number of payments to return in a single response. This value cannot exceed 200.
		'batchToken': null // String | A pagination cursor to retrieve the next set of results for your original query to the endpoint.
	};

	//return async content
	return new Promise(function(resolve, reject) {
		
		//calling the endpoint
		api.listPayments(locationId, opts).then(function(data) {
				
			//notifying successful call
			console.log('listPayments called successfully. Returning data');
		  	
		  	//returning data
			resolve(data)
			//resolve('roles success');

		}, function(error) {

			//returning error on unsucessful call
			reject(error);
		});

	});
};

//PRODUCTS FUNCTIONS 
function products_list() {
	//define local variables 
	var api = new SquareConnect.V1ItemsApi();
	var locationId = "M53KQT35YKE5C"; // String | The ID of the location to list items for.

	var opts = { 
	  //'batchToken': "batchToken_example" // String | A pagination cursor to retrieve the next set of results for your original query to the endpoint.
	};

	//return async content
	return new Promise(function(resolve, reject) {
		
		//calling the endpoint
		api.listItems(locationId, opts).then(function(data) {
				
			//notifying successful call
			console.log('listItems called successfully. Returning data');
		  	
		  	//returning data
			resolve(data)
			//resolve('roles success');

		}, function(error) {

			//returning error on unsucessful call
			reject(error);
		});

	});
};

//return the module
module.exports = square_api;