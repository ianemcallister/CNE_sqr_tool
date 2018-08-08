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
		
		//define private functions
		function calcGrossSales(txs) { 
			
			return 100; 
		};

		function calcTips(txs) { 
			
			return 100; 
		};

		function calcNetSales(txs) { 
			
			return 100; 
		};

		//define local functions
		$scope.updateTxBlockList = function() {
			//define local variables
			vm.txBlockList = [];
			vm.txBlockPath = [];
			vm.txBlockGrosses = [];
			vm.txBlockTips = [];
			vm.txBlockNets = [];

			//	1. BUILD THE TXBLOCKLIST
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

								if(splitSplitTest.length == 1) {
									//get the blocks
									vm.txBlockList.push(txBlock);

									//record the paths
									vm.txBlockPath.push({b:empKey, d:devKey, s:splitKey});

									//get the money
									vm.txBlockGrosses.push(calcGrossSales(txBlock.txs));
									vm.txBlockTips.push(calcTips(txBlock.txs));
									vm.txBlockNets.push(calcNetSales(txBlock.txs));
								}

							});

						}

					});

				}

			});

		console.log(vm.txBlockPath);
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

		vm.testing = function(id) {
			var device = vm.txBlockPath[id].d;
			var split = vm.txBlockPath[id].s;
			var tempBlock = vm.txBlocks[id][device][split];
			console.log('got this id', id, tempBlock);
			
		}

		console.log('in tx-block table controller');
		
	}

	//pass it back
	return directive;
}