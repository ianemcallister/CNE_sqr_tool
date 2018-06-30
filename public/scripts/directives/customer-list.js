/*
*	CUSTOMER LIST
*
*	This module is designed to 
*/

angular
	.module('cne')
	.directive('customerList', customerList);

/* @ngInject */
function customerList() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/customer-list.directive.htm',
		replace: true,
		scope: {
		},
		link: linkFunc,
		controller: customerListController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {}

	customerListController.$inject = ['$scope', '$log'];
	
	/* @ngInject */
	function customerListController($scope, $log) {
		//define local variables
		var self = this;

		console.log('in costomer List controller');
	}

	//pass it back
	return directive;
}