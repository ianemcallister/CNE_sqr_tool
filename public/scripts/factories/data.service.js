/*
*	BACKEND DATA SERVICE
*
*/

//define module
angular
    .module('cne')
    .factory('dataService', dataService);

//dependency injections
dataService.$inject = ['$http'];

//declare the service
/* @ngInject */
function dataService($http) {

	//define methods
	var dataService = {
		sqr_locations: {
			list: sqr_locations_list
		},
		sqr_employees: {
			list: sqr_employees_list
		},
		sqr_txs: {
			full_day: sqr_txs_day,
			select_txs: sqr_select_txs
		},
		sales_days: {
			compile_batch: compile_new_sales_day_batch
		}
	};

	function sqr_select_txs(txsList) {
		//define local variables
		var postObject = {};
		console.log('getting sqr txs');

		//iterate over all tx
		txsList.forEach(function(tx) {

		});

		return new Promise(function(resolve, reject) {
			//try POST
			$http({
				method: 'POST',
				url: '/v1/batch',
				headers: {
					'Content-Type': 'application/json'
				},
				data: postObject
			}).then(function successCallback(response) {
				
				resolve(response.data);
				
			}, function errorCallback(error) {
				reject(error);
			});
		});

	}

	//
	function sqr_locations_list() {
		//define local variables
		var postObject = {};

		console.log('getting locations list');

		return new Promise(function(resolve, reject) {
			//try POST
			$http({
				method: 'POST',
				url: '/squarepos/locations',
				headers: {
					'Content-Type': 'application/json'
				},
				data: postObject
			}).then(function successCallback(response) {
				
				resolve(response.data);
				
			}, function errorCallback(error) {
				reject(error);
			});
		});

	};

	//
	function sqr_employees_list(status, external_id, limit, order, begin_updated_at, end_updated_at, begin_created_at, end_created_at) {
		//define local variables
		var postObject = {
			status: status,
			external_id: external_id,
			limit: limit,
			order: order,
			begin_updated_at: begin_updated_at,
			end_updated_at: end_updated_at,
			begin_created_at: begin_created_at,
			end_created_at: end_created_at
		};

		console.log('getting employees list');

		return new Promise(function(resolve, reject) {
			//try POST
			$http({
				method: 'POST',
				url: '/squarepos/employees',
				headers: {
					'Content-Type': 'application/json'
				},
				data: postObject
			}).then(function successCallback(response) {
				
				resolve(response.data);
				
			}, function errorCallback(error) {
				reject(error);
			});
		});

	}

	//	TEST FUNCTION
	function compile_new_sales_day_batch(params) {
		
		//console.log('testing dataService');

		return new Promise(function(resolve, reject) {
			//try POST
			$http({
				method: 'POST',
				url: '/api/sales_days/compile_new_sales_days_batch',
				headers: {
					'Content-Type': 'application/json'
				},	
				data: params
			}).then(function successCallback(response) {
				
				resolve(response.data);
				
			}, function errorCallback(error) {
				reject(error);
			});
		});

	};

	//SQUARE TRANSACTION DAYS
	function sqr_txs_day(location, startDate, endDate) {
		//define local variables
		var postObject = {
			location: location,
			start: startDate,
			end: endDate
		};

		console.log('getting day\'s Transactions');

		return new Promise(function(resolve, reject) {
			//try POST
			$http({
				method: 'POST',
				url: '/squarepos/txs',
				headers: {
					'Content-Type': 'application/json'
				},
				data: postObject
			}).then(function successCallback(response) {
				
				resolve(response.data);
				
			}, function errorCallback(error) {
				reject(error);
			});
		});

	}

	//turn the method
    return dataService;	
};

