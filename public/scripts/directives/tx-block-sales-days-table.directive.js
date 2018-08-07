/*
*	TRANSACTIONS BLOCK TABLE DIRECTIVE
*
*	This module is designed to 
*/

angular
	.module('cne')
	.directive('txBlockSalesDaysTable', txBlockSalesDaysTable);

/* @ngInject */
function txBlockSalesDaysTable() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/tx-block-sales-days-table.directive.htm',
		replace: true,
		scope: {
			cmes: "="
		},
		link: linkFunc,
		controller: txBlockSalesDaysTableController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {}

	txBlockSalesDaysTableController.$inject = ['$scope', '$log', '$firebase', '$firebaseObject'];
	
	/* @ngInject */
	function txBlockSalesDaysTableController($scope, $log, $firebase, $firebaseObject) {
		//define local variables
		var vm = this;
		var customerListPath = "customers";

		//view model variables
		vm.customerList = $firebaseObject(firebase.database().ref().child(customerListPath));
		vm.customerName = "";

		//notify progress
		console.log('in tx-block sales days table controller');

		//private methods
		/*
		*	CUSTOMER LIST LOADED
		*
		*	This function executes after the customer list loads
		*/
		vm.customerList.$loaded()
		.then(function success(s) {
			
		}).catch(function error(e) {

		});
	}

	//pass it back
	return directive;
}