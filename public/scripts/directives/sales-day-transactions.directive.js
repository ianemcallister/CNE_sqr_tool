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
			txsList: "=",
			salesdaySelected: '='

		},
		link: linkFunc,
		controller: salesDayTxsController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {

		//update the salesdaysList when a new customer is selected
		scope.$watch('vm.salesdaySelected', function(newValue, oldValue) {
			
			//watch for a new value
			if(newValue) {
				
				//if the value changes download the required values
				//console.log('salesDay Selected');
				scope.loadSDTxs();

			}

		}, true);

	}

	salesDayTxsController.$inject = ['$scope', '$log', 'firebaseService'];
	/* @ngInject */
	function salesDayTxsController($scope, $log, firebaseService) {
		//define local variables
		var vm = this;
		vm.detailedTxList = [];
		
		console.log('in the salesDayTxsController');

		function loadARcrd(id) {
			var path = 'sales_days/' + id;

			//return async work
			return new Promise(function(resolve, reject) {

				//collected data
				firebaseService.get.a_record(path).then(function success(s) {
					resolve(s);
				}).catch(function error(e) {
					reject(e);
				});

			});

		}

		//	DEFINE SALES DAYS TRANSACTIONS
		$scope.loadSDTxs = function() {
			console.log('loading sd txs', vm.salesdaySelected);

			//
			loadARcrd(vm.salesdaySelected).then(function success(s) {
				console.log(s)
			}).catch(function error(e) {

			});
		};
	}

	//pass it back
	return directive;
}