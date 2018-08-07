/*
*	CUSTOMER LIST
*
*	This module is designed to 
*/

angular
	.module('cne')
	.directive('dateSelector', dateSelector);

/* @ngInject */
function dateSelector() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/date-selector.directive.htm',
		replace: true,
		scope: {
			selectedDate: "="
		},
		link: linkFunc,
		controller: dateSelectorController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {}

	dateSelectorController.$inject = ['$scope', '$log'];
	
	/* @ngInject */
	function dateSelectorController($scope, $log) {
		//define local variables
		var self = this;

		console.log('in date selector controller');

		/*
		*	DAY CHANGE 
		*
		*	This function incriments the day either forward or backward
		*/
		self.dayChange = function(direction) {
			//define local variables
			var dirHash = {"-":0, "+":1};
			var currentDate = moment(new Date(self.selectedDate));

			switch(dirHash[direction]) {
				case 0:
					currentDate.subtract(1,"day");
					break;
				case 1:
					currentDate.add(1,"day")
					break;
				default:
					break;
			};

			self.selectedDate = new Date(currentDate.format("MM-DD-YYYY"));

			//syncLists();
		}
	}

	//pass it back
	return directive;
}