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
	function linkFunc(scope, el, attr, ctrl) {

		//update the salesdaysList when a new customer is selected
		scope.$watch('vm.salesdaysList', function(newValue, oldValue) {
			
			//watch for a new value
			if(newValue) {
				
				//if the value changes download the required values
				scope.loadSaleDays();

			}

		}, true);

	};

	customerSalesDaysController.$inject = ['$scope', '$log', 'firebaseService'];
	/* @ngInject */
	function customerSalesDaysController($scope, $log, firebaseService) {
		//define local variables
		var vm = this;
		console.log('in the customerSalesDaysController');

		function loadATx(id) {
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

		//define scope variables
		$scope.loadSaleDays = function() {
			//define local variables
			var allPromises = [];

			//iterate through all values
			Object.keys(vm.salesdaysList).forEach(function(key){

				allPromises.push(loadATx(vm.salesdaysList[key]));

			});

			//run all promises
			Promise.all(allPromises).then(function success(s) {
				console.log('all promises returned', s);
				vm.salesdaysList = s
			}).catch(function error(e) {
				console.log('error',e);
			});


		};

	}

	//pass it back
	return directive;
}