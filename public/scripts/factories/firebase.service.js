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
			customer_list: get_customer_list,
			a_record: get_a_record
		},
		authUser: {
			email: authUser_email
		},
		compile: {
			customer_sales_days: compile_customer_sales_days
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
	        
	        ;

	    });
	}

	//	GET A RECORD
	function get_a_record(path) {

		//console.log('getting', path);
		//return async work
		return new Promise(function(resolve, reject) {
	        var desiredRecord = $firebaseObject(firebase.database().ref().child(path));
	        
	        desiredRecord.$loaded().then(function success(s) {
	        	resolve(s);
	        }).catch(function error(e) {
	        	reject(e);
	        });

	    });

	};

	//	COMPLILE CUSTOMER SALES DAYS
	function compile_customer_sales_days(customer_id) {
		//define local variables
		
	};	


	//	TEST FUNCTION
	function test() { return('good test from FB Service'); };

	//turn the method
    return FBService;	
};

