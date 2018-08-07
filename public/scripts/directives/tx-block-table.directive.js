/*
*	TRANSACTIONS BLOCK TABLE DIRECTIVE
*
*	This module is designed to 
*/

angular
	.module('cne')
	.directive('txBlockTable', txBlockTable);

/* @ngInject */
function txBlockTable() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/tx-block-table.directive.htm',
		replace: true,
		scope: {
			txBlocks: '='
		},
		link: linkFunc,
		controller: txBlockTableController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {}

	txBlockTableController.$inject = ['$scope', '$log'];
	
	/* @ngInject */
	function txBlockTableController($scope, $log) {
		//define local variables
		var self = this;

		console.log('in tx-block table controller');
	}

	//pass it back
	return directive;
}