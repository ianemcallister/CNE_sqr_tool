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
		sales_days: {
			compile_batch: compile_new_sales_day_batch
		},
		square: {
			
		}
	};

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

	//turn the method
    return dataService;	
};

