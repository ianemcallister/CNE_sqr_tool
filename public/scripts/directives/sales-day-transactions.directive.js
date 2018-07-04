/*
*	SALES DAY TRANSACTIONS
*
*	This module is designed to 
*/

angular
	.module('cne')
	.directive('salesDayTxs', salesDayTxs);

/* @ngInject */
function salesDayTxs() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/sales-day-transactions.directive.htm',
		replace: true,
		scope: {
			txsList: "="
		},
		link: linkFunc,
		controller: salesDayTxsController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {}

	salesDayTxsController.$inject = ['$scope', '$log'];
	/* @ngInject */
	function salesDayTxsController($scope, $log) {
		//define local variables
		var self = this;
		console.log('in the salesDayTxsController');
	}

	//pass it back
	return directive;
}