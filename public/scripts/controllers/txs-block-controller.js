angular
    .module('cne')
    .controller('txsBlockController', txsBlockController);

txsBlockController.$inject = ['$scope','$log'];

/* @ngInject */
function txsBlockController($scope, $log) {

	//define view model variable
	var vm = this;
	var yesterday = moment(new Date()).subtract(1, "day");

	//define view model variables
	vm.selectedDate = new Date(yesterday.format("MM-DD-YYYY"));
	vm.txBlocks = ['test', 'test', 'test'];

	//notify progress
	console.log('txsBlockController');

	//define view model function

}