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
		authUser: {
			email: authUser_email
		},
		test: test
	};

	//	AUTHENTICATE USER
	function authUser_email(email, password) {
		
		console.log('authenticating user')

		//return async work
		return new Promise(function (resolve, reject) {

			firebase.auth().signInWithEmailAndPassword(email, password).then(function sucess(s) {

				resolve(s);

			}).catch(function(error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				reject({code: errorCode , message: errorMessage});

			});
		});

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
