/*
*
*
*/

//define module
angular
    .module('cne')
    .factory('firebaseService', firebaseService);

//dependency injections
firebaseService.$inject = ['$firebase', '$firebaseObject', '$firebaseArray'];

//declare the service
/* @ngInject */
function firebaseService($firebase, $firebaseObject, $firebaseArray) {

	//define methods
	var FBService = {
		get: {
			customer_list: get_customer_list
		},
		test: test
	};

	//	GET CUSTOMER LIST
	function get_customer_list() {
		//define local variables

		//console.log('getting customer list');

		//return async work
		return new Promise(function(resolve, reject) {
	        
	        //var test = 

	        //hit the server for the 
	        resolve(["one", "two", 'three']);

	    });
	}

	//	TEST FUNCTION
	function test() { return('good test from FB Service'); };

	//turn the method
    return FBService;	
};

