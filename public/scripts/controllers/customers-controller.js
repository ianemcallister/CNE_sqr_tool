angular
    .module('cne')
    .controller('customersController', customersController);

customersController.$inject = ['$scope','$log', 'customerList', 'firebaseService', '$firebase', '$firebaseObject', '$firebaseArray'];

/* @ngInject */
function customersController($scope, $log, customerList, firebaseService, $firebase, $firebaseObject, $firebaseArray) {

	//define view model variable
	var vm = this;
	vm.customerList = $firebaseArray(firebase.database().ref().child('customers'));
	vm.selectedCustomer = '';
	vm.testList = ['a', 'b', 'c']; //$firebaseArray(firebase.database().ref().child('customers').child('customer_list'));
	vm.state = {
		selected: {
			customer: {
				$index: "",
				$id: "",

			}
		}
	};

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
			//vm.customerList = s;
			vm.customerList = $firebaseArray(firebase.database().ref().child('customers').child('customer_list'));

			//reflect the changes
			$scope.$apply();

		}).catch(function error(e) {
			//if there was an error throw the error
			console.log('error');
		});
	};

	/*
	*	VIEW MODEL FUNCTIONS GO HERE
	*
	*/	
	//	SELECT CLICKED CUSTOMER
	vm.selectCustomer = function(index_id) {
		//define local variables
		vm.state.selected.customer.$id = index_id;
		vm.selectedCustomer = $firebaseObject(firebase.database().ref().child('customers').child(vm.customerList[index_id].$id));
	};

	//	UPDATE THE CUSTOMER RECORD
	vm.updateCustomer = function() {
		vm.selectedCustomer.$save().then(function succes(s) {
			console.log('updated record successfully');
		}).catch(function error(e) {
			console.log('error updating record', e);
		});
	};

	//	MOVE TO THE NEXT CUSTOMER
	vm.changeRecord = function(select) {
		//define local variables
		var optn = { "prev": 0, "next": 1 };
		var index_id = vm.state.selected.customer.$id;

		switch(optn[select]) {
			case 0:
				//console.log('previous record');
				vm.selectCustomer(vm.state.selected.customer.$id - 1);
				break;
			case 1:
				//console.log('next record');
				vm.selectCustomer(vm.state.selected.customer.$id + 1);
				break;
			default:
				break;
		}
	};

	//run the test

	//on page load
	//load_customer_list();

}