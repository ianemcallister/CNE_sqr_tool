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

	txBlockSalesDaysTableController.$inject = ['$scope', '$log'];
	
	/* @ngInject */
	function txBlockSalesDaysTableController($scope, $log) {
		//define local variables
		var self = this;

		console.log('in tx-block sales days table controller');
	}

	//pass it back
	return directive;
}