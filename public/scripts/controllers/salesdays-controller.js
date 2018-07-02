angular
    .module('cne')
    .controller('salesDaysController', salesDaysController);

salesDaysController.$inject = ['$scope','$log'];

/* @ngInject */
function salesDaysController($scope, $log) {

	//define view model variable
	var vm = this;

	$log.info('in the sales days controller');	//TODO: TAKE THIS OUT LATER

	//define local functions

	//run the test


}