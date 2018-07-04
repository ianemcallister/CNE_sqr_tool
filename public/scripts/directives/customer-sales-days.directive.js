/*
*	SALES DAY TRANSACTIONS
*
*	This module is designed to 
*/

angular
	.module('cne')
	.directive('customerSalesDays', customerSalesDays);

/* @ngInject */
function customerSalesDays() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/customer-sales-days.directive.htm',
		replace: true,
		scope: {
			salesdaysList: "="
		},
		link: linkFunc,
		controller: customerSalesDaysController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {}

	customerSalesDaysController.$inject = ['$scope', '$log'];
	/* @ngInject */
	function customerSalesDaysController($scope, $log) {
		//define local variables
		var self = this;
		console.log('in the customerSalesDaysController');
	}

	//pass it back
	return directive;
}