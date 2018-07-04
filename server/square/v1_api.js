/*
*	SQUARE V1
*
*	This module serves as the connection between Ah-Nuts Server and SquareUp.com.
*/

//define dependencies
var fetch 			= require('node-fetch');

//define global variables
var _accessToken 	= process.env.SQUARE_APP_TOKEN;
//var _sandboxToken 	= process.env.SQUARE_SANDBOX_APP_TOKEN;
//var _applicationID 	= process.env.SQUARE_APP_ID;
//var _sandboxID 		= process.env.SQUARE_SANDBOX_APP_ID;
var _baseURL 		= 'https://connect.squareup.com/';
var _headers 		= {
	'Authorization': 'Bearer ' + _accessToken, //process.env.SQUARE_APP_TOKEN,
	'Accept': 'application/json',
	'Content-Type': 'application/json'
};

//console.log('_accessToken', _accessToken);
//console.log("_headers", _headers);

//define module
var squarev1 = {
	_service: {
		buffer_extract: buffer_extract
	},
	payments: {
		list: payments_list,
		retrieve: retrieve_payment
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
	},
	webhooks: {
		list: webhooks_list,
		update: webhooks_update

	}
};

//REQUIRED SERVICES
function buffer_extract(buffer) {
	//define local variables
	var self = this;

	//return async content
	return new Promise(function(resolve, reject) {

		//access buffer
		buffer.buffer().then(function(data) {

			//pass back the json
			resolve(JSON.parse(data.toString('utf8')));

		});

	});

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
	var self = this;
	var thisUrl = _baseURL + 'v1/me/locations';
	var options = {
		method: 'GET',
		headers: _headers
	};

	//return for async work
	return new Promise(function(resolve, reject) {

		console.log('fetching', thisUrl, options);

		//fetch the details
		fetch(thisUrl, options)
		.then(function success(s) {

			//upon success proceed
			if(s.status == 200) {
				
				//retrieve buffer content
				self._service.buffer_extract(s)
				.then(function success(ss) {

					//send the data back
					resolve(ss);


				}).catch(function error(ee) {

				});

			} else if(s.status == 401) {
				console.log('Unauthorized');
				reject('boo');
			} else {
				console.log('there was an error');
				reject(s);
			}

		}).catch(function error(e) {
			reject(e);
		});

	});
};

//PAYMENTS FUNCTIONS 
function payments_list() {
	//define local variables
};

/*
*	RETRIEVE PAYMENT
*
*	GET /v1/{location_id}/payments/{payment_id}
*
*	Example Request: https://connect.squareup.com/v1/LOCATION_ID/payments/Jq74mCczmFXk1tC10GB
*
*	Provides comprehensive information for a single payment.
*
*	Required permissions: PAYMENTS_READ
*
*	Path Parameters:
*		location_id [string] - The ID of the payment's associated location. Get a business' locations with the List Locations endpoint.
*		payment_id [string] - The payment's Square-issued ID. You obtain this value from Payment objects returned by the List Payments endpoint, or  Settlement objects returned by the List Settlements endpoint.
*
*	Return Value: A Payment object that describes the requested payment.
*	Example Response Body:
*	{
	  "id": "Jq74mCczmFXk1tC10GB",
	  "merchant_id": "JGHJ0343",
	  "created_at": "2014-07-07T18:45:00Z",
	  "creator_id": "18YC4JBH91E1G",
	  "device": {
	    "name": "Front of store"
	  },
	  "payment_url": "https://squareup.com/dashboard/sales/transactions/Jq74mCczmFXk1tC10GB",
	  "inclusive_tax_money": {
	    "currency_code": "USD",
	    "amount": 0
	  },
	  "additive_tax_money": {
	    "currency_code": "USD",
	    "amount": 24
	  },
	  "tax_money": {
	    "currency_code": "USD",
	    "amount": 24
	  },
	  "tip_money": {
	    "currency_code": "USD",
	    "amount": 0
	  },
	  "discount_money": {
	    "currency_code": "USD",
	    "amount": -45
	  },
	  "total_collected_money": {
	    "currency_code": "USD",
	    "amount": 429
	  },
	  "processing_fee_money": {
	    "currency_code": "USD",
	    "amount": -12
	  },
	  "net_total_money": {
	    "currency_code": "USD",
	    "amount": 417
	  },
	  "refunded_money": {
	    "currency_code": "USD",
	    "amount": 0
	  },
	  "inclusive_tax": [],
	  "additive_tax": [
	    {
	      "name": "Sales tax",
	      "rate": "0.060000",
	      "inclusion_type": "ADDITIVE",
	      "applied_money": {
	        "currency_code": "USD",
	        "amount": 24
	      }
	    }
	  ],
	  "tender": [
	    {
	      "type": "CREDIT_CARD",
	      "name": "Credit Card",
	      "total_money": {
	        "currency_code": "USD",
	        "amount": 429
	      },
	      "card_brand": "DISCOVER",
	      "pan_suffix": "1117",
	      "entry_method": "SWIPED"
	    }
	  ],
	  "refunds": [],
	  "itemizations": [
	    {
	      "name": "Milkshake",
	      "quantity": "1.00000000",
	      "notes": "Delicious!",
	      "item_variation_name": "Small",
	      "item_detail": {
	        "category_name": "Beverages",
	        "sku": "123",
	        "item_id": "a1c50178-19ad-4783-aee4-4f2548ca8254",
	        "item_variation_id": "8219dd37-666f-4855-be73-b5d28826580b"
	      },
	      "total_money": {
	        "currency_code": "USD",
	        "amount": 429
	      },
	      "single_quantity_money": {
	        "currency_code": "USD",
	        "amount": 400
	      },
	      "gross_sales_money": {
	        "currency_code": "USD",
	        "amount": 450
	      },
	      "discount_money": {
	        "currency_code": "USD",
	        "amount": -45
	      },
	      "net_sales_money": {
	        "currency_code": "USD",
	        "amount": 405
	      },
	      "taxes": [
	        {
	          "name": "Sales tax",
	          "rate": "0.060000",
	          "inclusion_type": "ADDITIVE",
	          "applied_money": {
	            "currency_code": "USD",
	            "amount": 24
	          },
	          "fee_id": "19498df7-3fb0-4c96-8b47-860480718abk"
	        }
	      ],
	      "discounts": [
	        {
	          "name": "Early Bird",
	          "applied_money": {
	            "currency_code": "USD",
	            "amount": -45
	          },
	          "discount_id": "0f075287-094c-4de7-9e23-cff5d41c910b"
	        }
	      ],
	      "modifiers": [
	        {
	          "name": "Whipped Cream",
	          "applied_money": {
	            "currency_code": "USD",
	            "amount": 50
	          },
	          "modifier_option_id": "39059fd0-ae9d-4eb3-b6e8-dd3198f019b8"
	        }
	      ]
	    }
	  ]
	}
*/
function retrieve_payment(payment_id, location_id) {
	//define local variables
	var self = this;
	var thisUrl = _baseURL + 'v1/' + location_id + '/payments/' + payment_id;
	var options = {
		method: 'GET',
		headers: _headers
	};

	//return for async work
	return new Promise(function(resolve, reject) {

		console.log('fetching', thisUrl, options);

		//fetch the details
		fetch(thisUrl, options)
		.then(function success(s) {

			//upon success proceed
			if(s.status == 200) {
				
				//retrieve buffer content
				buffer_extract(s)
				.then(function success(ss) {

					//send the data back
					resolve(ss);


				}).catch(function error(ee) {

				});

			} else if(s.status == 401) {
				console.log('Unauthorized');
				reject('boo');
			} else {
				console.log('there was an error');
				reject(s);
			}

		}).catch(function error(e) {
			reject(e);
		});

	});

};

//ROLES FUNCTIONS 
function roles_list() {
	//define local variables
};

//EMPLOYEES FUNCTIONS 
function employees_list() {
	//define local variables
	var self = this;
	var thisUrl = _baseURL + 'v1/me/employees';
	var options = {
		method: 'GET',
		headers: _headers
	};

	//return for async work
	return new Promise(function(resolve, reject) {

		console.log('fetching', thisUrl, options);

		//fetch the details
		fetch(thisUrl, options)
		.then(function success(s) {

			buffer_extract(s).then(function success(ss) {
				resolve(ss);
			});

		}).catch(function error(e) {
			reject(e);
		});

	});
};

//PRODUCTS FUNCTIONS 
function products_list() {
	//define local variables
};

/*
*	LIST WEBHOOKS
*/
function webhooks_list() {
	//define local variables
	var self = this;
	var thisUrl = _baseURL + 'v1/M53KQT35YKE5C/webhooks';
	var options = {
		method: 'GET',
		headers: _headers
	};

	//return for async work
	return new Promise(function(resolve, reject) {

		console.log('fetching', thisUrl, options);

		//fetch the details
		fetch(thisUrl, options)
		.then(function success(s) {

			buffer_extract(s).then(function success(ss) {
				resolve(ss);
			});

		}).catch(function error(e) {
			reject(e);
		});

	});
};

/*
*	SET WEBHOOKS
*/
function webhooks_update(request_body) {
//define local variables
	var self = this;
	var thisUrl = _baseURL + 'v1/M53KQT35YKE5C/webhooks';
	var options = {
		method: 'PUT',
		headers: _headers,
		body: JSON.stringify(request_body)
	};


	//return for async work
	return new Promise(function(resolve, reject) {

		console.log('fetching', thisUrl, options);

		//fetch the details
		fetch(thisUrl, options)
		.then(function success(s) {

			buffer_extract(s).then(function success(ss) {
				resolve(ss);
			});

		}).catch(function error(e) {
			reject(e);
		});

	});
};

//return the module
module.exports = squarev1;