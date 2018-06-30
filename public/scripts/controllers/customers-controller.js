angular
    .module('cne')
    .controller('customersController', customersController);

customersController.$inject = ['$scope','$log', 'customerList', 'firebaseService', '$firebase', '$firebaseObject', '$firebaseArray'];

/* @ngInject */
function customersController($scope, $log, customerList, firebaseService, $firebase, $firebaseObject, $firebaseArray) {

	//define view model variable
	var vm = this;
	vm.customerList = ['a', 'b', 'c'];
	vm.testList = $firebaseArray(firebase.database().ref().child('customers'));

	//identify where we are
	$log.info('in the customers controller');	//TODO: TAKE THIS OUT LATER
	

	/*
	*	LOCAL FUNCTIONS GO HERE
	*
	*/

	//	LOAD CUSTOMER LIST
	function load_customer_list() {
		
		//track starting function
		//console.log('loading the customer list');
		
		//gather the data
		firebaseService.get.customer_list().then(function success(s) {
			
			//console.log('got this respons', s);
			
			//when the list has been loaded update the variables
			vm.customerList = s;

			//reflect the changes
			$scope.$apply();

		}).catch(function error(e) {
			//if there was an error throw the error
			console.log('error');
		});
	};

	//run the test

	//on page load
	load_customer_list();

}