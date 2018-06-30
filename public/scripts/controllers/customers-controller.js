angular
    .module('cne')
    .controller('customersController', customersController);

customersController.$inject = ['$scope','$log', 'customerList'];

/* @ngInject */
function customersController($scope, $log, customerList) {

	//define view model variable
	var vm = this;

	$log.info('in the customers controller', customerList);	//TODO: TAKE THIS OUT LATER

	//define local functions

	//run the test


}