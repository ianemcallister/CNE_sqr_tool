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
			txBlocks: '=',
			cmes: "="
		},
		link: linkFunc,
		controller: txBlockTableController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {
		//update the salesdaysList when a new customer is selected
		scope.$watch('vm.txBlocks', function(newValue, oldValue) {
			
			//watch for a new value
			if(newValue) {
				
				//if the value changes download the required values
				scope.updateTxBlockList();
				//console.log(newValue);

			}

		}, true);
	}

	txBlockTableController.$inject = ['$scope', '$log', 'dataService', '$q'];
	
	/* @ngInject */
	function txBlockTableController($scope, $log, dataService, $q) {
		//define local variables
		var vm = this;

		//define view model variables
		vm.txBlockList = [];

		//define local functions
		$scope.updateTxBlockList = function() {
			//define local variables
			vm.txBlockList = [];

			//iterate through all employees
			Object.keys(vm.txBlocks).forEach(function(empKey) {
				//define local variables
				var employee = vm.txBlocks[empKey];
				var empSplitTest = empKey.split("$");

				//if good test move deeper
				if(empSplitTest.length == 1) {
					
					//iterate through all devices
					Object.keys(employee).forEach(function(devKey) {
						//define local variables
						var device = employee[devKey];
						var devSplitTest = devKey.split("$");

						//if good test move deeper
						if(devSplitTest.length == 1) {

							//iterate through all splits
							Object.keys(device).forEach(function(splitKey) {
								//define local variables
								var txBlock = device[splitKey];
								var splitSplitTest = splitKey.split("$");

								if(splitSplitTest.length == 1) vm.txBlockList.push(txBlock);

							});

						}

					});

				}

			});
		};

		//define view model functions
		/*
		*	WINDOW PARSE
		*/
		vm.windowParse = function(window, isStart) {
			//define local varaibles
			var windowSplit = window.split("/");
			if(isStart) return windowSplit[0]
			else return windowSplit[1];
		};

		/*
		*	TX COUNT
		*/
		vm.countTxs = function(txs) {
			//define local varaibles
			var counter = 0;
			Object.keys(txs).forEach(function() {
				counter++;
			});
			return counter;
		};

		vm.calcGrossSales = function(txs) {
			//define local variables
			var txList = ['50E8Ae5FxUoRq1dwfGZgLQB', 'VmOqJuqH2G2IIx266JwQKQB', '9Gaj6n5AtFOv3ITKAaZKKQB'];
			console.log('calculating the gross');


		};
		vm.calcTips = function(txs) {};
		vm.calcNetSales = function(txs) {}

		console.log('in tx-block table controller');
	}

	//pass it back
	return directive;
}